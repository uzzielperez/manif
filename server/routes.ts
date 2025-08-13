import express, { type Express, type Request, type Response, type Router, type RequestHandler } from "express";
import { createServer } from "http";
import { storage } from "./storage.ts";
import { generateMeditation, listModels } from "./groq.ts";
import { synthesizeSpeech, listVoices } from "./elevenlabs.ts";
import { createPaymentIntent, confirmPaymentIntent, createCheckoutSession, retrieveCheckoutSession } from "./stripe.ts";
import { insertMeditationSchema, updateMeditationSchema } from "../shared/schema.ts";
import { createManifestationGuideHTML, saveManifestationGuideHTML } from "./pdf-generator.ts";
import { ZodError } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express) {
  console.log('Registering routes:');
  
  // Create a router
  const router: Router = express.Router();
  
  // Serve static audio files
  const audioDir = path.join(process.cwd(), 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  console.log('  Static /audio');
  app.use('/audio', express.static(audioDir));
  
  // Serve static download files
  const downloadsDir = path.join(process.cwd(), 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  console.log('  Static /downloads');
  app.use('/downloads', express.static(downloadsDir));
  
  // Add Stripe checkout route
  console.log('  POST /api/payment/create-checkout');
  router.post("/payment/create-checkout", (async (req, res) => {
    try {
      const { amount, successUrl, cancelUrl, metadata } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      
      if (!successUrl || !cancelUrl) {
        return res.status(400).json({ error: "Success and cancel URLs are required" });
      }
      
      console.log(`Creating checkout session for amount: $${amount}`);
      console.log(`Success URL: ${successUrl}`);
      console.log(`Cancel URL: ${cancelUrl}`);
      
      const session = await createCheckoutSession(amount, successUrl, cancelUrl, metadata);
      
      res.json(session);
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      res.status(500).json({ 
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }) as RequestHandler);
  
  console.log('  GET /api/payment/checkout-status/:sessionId');
  router.get("/payment/checkout-status/:sessionId", (async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      
      console.log(`Checking checkout session status: ${sessionId}`);
      const sessionStatus = await retrieveCheckoutSession(sessionId);
      
      res.json(sessionStatus);
    } catch (error) {
      console.error('Failed to retrieve checkout session:', error);
      res.status(500).json({ 
        error: "Failed to retrieve checkout session",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }) as RequestHandler);
  
  // Download manifestation guide after payment verification
  console.log('  GET /api/download/manifestation-guide/:sessionId');
  router.get("/download/manifestation-guide/:sessionId", (async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      
      console.log(`Verifying payment for manifestation guide download: ${sessionId}`);
      
      // Verify the payment status with Stripe
      const sessionStatus = await retrieveCheckoutSession(sessionId);
      if (!sessionStatus.success) {
        return res.status(403).json({ 
          error: "Payment verification failed", 
          paymentStatus: sessionStatus.status 
        });
      }
      
      console.log(`Payment verified, generating manifestation guide for session: ${sessionId}`);
      
      // Generate the HTML guide
      const htmlContent = createManifestationGuideHTML();
      
      // Set headers for HTML file download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="Manifestation-AI-Blueprint-Starter-Guide.html"');
      
      // Send the HTML content as a downloadable file
      res.send(htmlContent);
    } catch (error) {
      console.error('Failed to download manifestation guide:', error);
      res.status(500).json({ 
        error: "Failed to download manifestation guide",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }) as RequestHandler);
  
  // Generate manifestation guide (returns download URL)
  console.log('  POST /api/generate/manifestation-guide');
  router.post("/generate/manifestation-guide", (async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Payment session ID is required" });
      }
      
      // Verify the payment status
      const sessionStatus = await retrieveCheckoutSession(sessionId);
      if (!sessionStatus.success) {
        return res.status(403).json({ 
          error: "Payment verification failed", 
          paymentStatus: sessionStatus.status 
        });
      }
      
      // Save the HTML file to downloads directory
      const fileName = await saveManifestationGuideHTML();
      const downloadUrl = `/downloads/${fileName}`;
      
      res.json({
        success: true,
        message: "Manifestation guide generated successfully",
        downloadUrl,
        fileName
      });
    } catch (error) {
      console.error('Failed to generate manifestation guide:', error);
      res.status(500).json({ 
        error: "Failed to generate manifestation guide",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }) as RequestHandler);
  
  // Add Stripe payment routes (legacy)
  console.log('  POST /api/payment/create-intent');
  router.post("/payment/create-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      
      console.log(`Creating payment intent for amount: $${amount}`);
      const paymentIntent = await createPaymentIntent(amount);
      
      res.json(paymentIntent);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      res.status(500).json({ 
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  console.log('  POST /api/payment/confirm');
  router.post("/payment/confirm", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }
      
      console.log(`Confirming payment intent: ${paymentIntentId}`);
      const confirmation = await confirmPaymentIntent(paymentIntentId);
      
      res.json(confirmation);
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      res.status(500).json({ 
        error: "Failed to confirm payment",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Add this new route to list models
  console.log('  GET /api/models');
  router.get("/models", async (_req: Request, res: Response) => {
    try {
      const models = await listModels();
      res.json(models.map(model => model.id));
    } catch (error) {
      console.error('Failed to list models:', error);
      res.status(500).json({ error: "Failed to list models" });
    }
  });

  // Get available voices
  console.log('  GET /api/voices');
  router.get("/voices", async (_req: Request, res: Response) => {
    try {
      const voicesData = await listVoices();
      res.json(voicesData);
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      res.status(500).json({ error: "Failed to fetch voices" });
    }
  });

  // Stream meditation audio
  console.log('  GET /api/meditations/:id/audio');
  router.get("/meditations/:id/audio", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const voiceId = req.query.voice_id as string;
      if (!voiceId) {
        return res.status(400).json({ error: "Voice ID is required" });
      }

      const meditation = await storage.getMeditation(id);
      if (!meditation || !meditation.content) {
        return res.status(404).json({ error: "Meditation content not found" });
      }

      const audioBuffer = await synthesizeSpeech(meditation.content, voiceId);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
        'Content-Disposition': 'inline',
      });

      res.send(audioBuffer);
    } catch (error) {
      console.error('Failed to generate audio:', error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
  });

  // Generate audio for meditation text
  console.log('  POST /api/meditations/audio');
  router.post("/meditations/audio", async (req, res) => {
    try {
      const { text, voiceId, duration } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      
      if (!voiceId) {
        return res.status(400).json({ error: "Voice ID is required" });
      }
      
      console.log(`Generating audio for meditation with voice ID: ${voiceId}`);
      console.log(`Text length: ${text.length} characters`);
      
      // Generate audio from the text
      const audioBuffer = await synthesizeSpeech(text, voiceId);
      
      // Convert buffer to base64 for response
      const base64Audio = audioBuffer.toString('base64');
      
      // Create a data URL that can be used in an audio element
      const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
      
      res.json({
        success: true,
        audioUrl,
        duration: duration || 5, // Default to 5 minutes if not specified
        format: 'mp3'
      });
    } catch (error) {
      console.error('Failed to generate audio:', error);
      res.status(500).json({ 
        error: "Failed to generate audio",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Save audio file to disk (for terminal download)
  console.log('  POST /api/meditations/save-audio');
  router.post("/meditations/save-audio", async (req, res) => {
    try {
      const { text, voiceId, filename } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      
      if (!voiceId) {
        return res.status(400).json({ error: "Voice ID is required" });
      }
      
      console.log(`Generating audio file for download with voice ID: ${voiceId}`);
      
      // Generate audio from the text
      const audioBuffer = await synthesizeSpeech(text, voiceId);
      
      // Create audio directory if it doesn't exist
      const audioDir = path.join(process.cwd(), 'audio');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      // Save the audio file
      const defaultFilename = `meditation-${Date.now()}.mp3`;
      const safeFilename = filename ? 
        filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3' : 
        defaultFilename;
      
      const filePath = path.join(audioDir, safeFilename);
      fs.writeFileSync(filePath, audioBuffer);
      
      console.log(`Audio saved to: ${filePath}`);
      
      res.json({
        success: true,
        message: "Audio file saved successfully",
        filePath: filePath,
        filename: safeFilename
      });
    } catch (error) {
      console.error('Failed to save audio file:', error);
      res.status(500).json({ 
        error: "Failed to save audio file",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Save base64 audio data as file (for current meditation without regenerating)
  console.log('  POST /api/meditations/save-audio-file');
  router.post("/meditations/save-audio-file", async (req, res) => {
    try {
      const { audioData, filename } = req.body;
      
      if (!audioData) {
        return res.status(400).json({ error: "Audio data is required" });
      }
      
      // Create audio directory if it doesn't exist
      const audioDir = path.join(process.cwd(), 'audio');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      // Create a valid filename
      const safeFilename = filename ? 
        filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3' : 
        `meditation-${Date.now()}.mp3`;
      
      const filePath = path.join(audioDir, safeFilename);
      
      // Convert base64 to buffer and save
      const audioBuffer = Buffer.from(audioData, 'base64');
      fs.writeFileSync(filePath, audioBuffer);
      
      console.log(`Saved audio file to: ${filePath}`);
      
      res.json({
        success: true,
        message: "Audio file saved successfully",
        filePath: filePath,
        filename: safeFilename
      });
    } catch (error) {
      console.error('Failed to save audio file:', error);
      res.status(500).json({ 
        error: "Failed to save audio file",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Create a new meditation
  console.log('  POST /api/meditations');
  router.post("/meditations", async (req, res) => {
    try {
      const { prompt, model } = req.body;
      console.log('Received meditation prompt:', prompt, 'with model:', model);

      // Log every step
      console.log('Generating meditation...');
      let generated;
      
      try {
        // Pass the model parameter
        generated = await generateMeditation(prompt, model);
        console.log('Generated meditation content successfully, length:', generated.content.length);
      } catch (genError: any) {
        console.error('Specific generation error:', genError);
        console.error('Error stack:', genError.stack);
        throw genError;
      }

      console.log('Truncating content if needed...');
      // Before saving to database, truncate if needed
      const maxContentLength = 10000;
      const truncatedContent = generated.content.length > maxContentLength 
        ? generated.content.substring(0, maxContentLength - 3) + "..."
        : generated.content;
      console.log('Content ready, truncated:', generated.content.length > maxContentLength);

      // Skip database storage and create a synthetic meditation object
      const meditation = {
        id: Date.now(), // Use timestamp as a temporary ID
        prompt,
        content: truncatedContent,
        model: model,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: null
      };
      
      console.log('Generated meditation without database storage');

      res.json({ ...meditation, duration: generated.duration });
    } catch (error: any) {
      console.error('FULL ERROR DETAILS:');
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error stringified:', JSON.stringify(error, null, 2));
      
      res.status(500).json({ 
        error: "Failed to create meditation", 
        details: error?.message || "Unknown error" 
      });
    }
  });

  // List all meditations
  console.log('  GET /api/meditations');
  router.get("/meditations", async (_req, res) => {
    try {
      const meditations = await storage.listMeditations();
      res.json(meditations);
    } catch (error) {
      console.error('Failed to list meditations:', error);
      res.status(500).json({ error: "Failed to list meditations" });
    }
  });

  // Get a specific meditation
  console.log('  GET /api/meditations/:id');
  router.get("/meditations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const meditation = await storage.getMeditation(id);
      if (!meditation) {
        return res.status(404).json({ error: "Meditation not found" });
      }

      res.json(meditation);
    } catch (error) {
      console.error('Failed to fetch meditation:', error);
      res.status(500).json({ error: "Failed to fetch meditation" });
    }
  });

  // Rate a meditation
  console.log('  PATCH /api/meditations/:id/rate');
  router.patch("/meditations/:id/rate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const { rating } = updateMeditationSchema.parse(req.body);
      const meditation = await storage.rateMeditation(id, rating);

      res.json(meditation);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error('Failed to rate meditation:', error);
        res.status(500).json({ error: "Failed to rate meditation" });
      }
    }
  });

  // Delete a meditation
  console.log('  DELETE /api/meditations/:id');
  router.delete("/meditations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      await storage.deleteMeditation(id);
      res.status(204).send();
    } catch (error) {
      console.error('Failed to delete meditation:', error);
      res.status(500).json({ error: "Failed to delete meditation" });
    }
  });

  // Add a simple test endpoint
  console.log('  GET /api/test');
  router.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is working' });
  });

  // Add a Groq test endpoint
  console.log('  GET /api/groq-test');
  router.get('/groq-test', async (req, res) => {
    console.log("==== GROQ TEST ENDPOINT CALLED ====");
    try {
      console.log("Testing Groq connection...");
      console.log("GROQ_API_KEY set:", process.env.GROQ_API_KEY ? `Yes (length: ${process.env.GROQ_API_KEY.length})` : "No");
      
      // Test a basic fetch first
      try {
        console.log("Testing basic fetch to Groq API...");
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("Fetch status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Basic fetch successful, models count:", data.data?.length || 0);
        } else {
          console.log("Basic fetch failed:", response.statusText);
        }
      } catch (fetchError) {
        console.error("Basic fetch error:", fetchError);
      }
      
      // Now try listModels
      console.log("Trying listModels function...");
      const models = await listModels();
      console.log("listModels returned:", models);
      
      // Return success with models list
      res.json({ 
        status: 'ok', 
        message: 'Groq connection successful',
        models: models
      });
      console.log("==== GROQ TEST ENDPOINT COMPLETED SUCCESSFULLY ====");
    } catch (error: any) {
      console.error("==== GROQ TEST ERROR ====");
      console.error("Groq test error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      res.status(500).json({ 
        status: 'error', 
        message: 'Groq connection failed',
        error: error?.message || String(error)
      });
    }
  });

  // Add a DB test endpoint
  console.log('  GET /api/db-test');
  router.get('/db-test', async (req, res) => {
    console.log("==== DB TEST ENDPOINT CALLED ====");
    try {
      // Try a simple write and read
      const testPrompt = "Test prompt for debugging";
      const testContent = "Short test content to verify database operations";
      
      console.log("Creating test meditation...");
      const created = await storage.createMeditation({
        prompt: testPrompt,
        content: testContent,
      });
      console.log("Test meditation created:", created);
      
      const retrieved = await storage.getMeditation(created.id);
      console.log("Test meditation retrieved:", retrieved);
      
      // Clean up
      await storage.deleteMeditation(created.id);
      console.log("Test meditation deleted");
      
      res.json({ 
        status: 'ok',
        message: 'Database operations successful'
      });
    } catch (error: any) {
      console.error("==== DB TEST ERROR ====");
      console.error("DB test error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      res.status(500).json({
        status: 'error',
        message: 'Database test failed',
        error: error?.message || String(error)
      });
    }
  });

  // Add this endpoint to update meditation content
  console.log('  PATCH /api/meditations/:id/content');
  router.patch("/meditations/:id/content", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const { content } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "Content is required" });
      }

      // Update the content in storage
      const meditation = await storage.updateMeditationContent(id, content);

      res.json(meditation);
    } catch (error) {
      console.error('Failed to update meditation content:', error);
      res.status(500).json({ error: "Failed to update meditation content" });
    }
  });

  // Download meditation text
  console.log('  POST /api/meditations/download');
  router.post("/meditations/download", async (req, res) => {
    try {
      const { content, title, paymentIntentId } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Meditation content is required" });
      }
      
      // Verify payment before allowing download
      if (!paymentIntentId) {
        return res.status(403).json({ error: "Payment is required to download content" });
      }
      
      // Verify the payment status with Stripe
      const confirmation = await confirmPaymentIntent(paymentIntentId);
      if (!confirmation.success) {
        return res.status(403).json({ 
          error: "Payment verification failed", 
          paymentStatus: confirmation.status 
        });
      }
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${title || 'meditation'}.txt"`);
      
      // Send the content as a downloadable file
      res.send(content);
    } catch (error) {
      console.error('Failed to download meditation:', error);
      res.status(500).json({ error: "Failed to download meditation" });
    }
  });

  // Mount the router
  app.use('/api', router);

  // Return the server
  const httpServer = createServer(app);
  return httpServer;
}