# Marketing Agents - Owner's Guide

## How to Track Agent Work & Progress

As the owner of Manifest.ink, you can monitor all your marketing agents through the **Marketing Dashboard**.

### Accessing the Dashboard

1. **Via URL**: Navigate to `https://manifest.ink/marketing-dashboard`
2. **Direct Link**: Add a link in your admin navigation (if you have one)

### What You Can See

#### Overview Section
- **Total Agents**: Number of all registered agents
- **Enabled Agents**: Agents currently active and posting
- **Channels Active**: Number of different marketing channels being used

#### Per-Agent Information

For each agent, you'll see:

1. **Status Indicators**
   - ✅ **Enabled/Disabled**: Whether the agent is active
   - ⏰ **Ready to Post**: If the agent is scheduled to post now

2. **Performance Stats**
   - **Total Actions**: How many posts/actions the agent has made
   - **Average Score**: Overall performance score (0-100)
     - 🟢 Green (70+): Excellent performance
     - 🟡 Yellow (50-69): Good performance
     - 🔴 Red (<50): Needs improvement
   - **Success Rate**: Percentage of successful actions
   - **Recent Average**: Performance trend (last 5 actions)

3. **Last Action**
   - Preview of the most recent post/content
   - Status (posted, pending, failed)
   - Timestamp

4. **Agent Learnings**
   - **Best Performing Topics**: Keywords/topics that generate the most engagement
   - **Optimal Posting Times**: Hours of day when posts perform best

### Dashboard Features

- **Auto-Refresh**: Toggle to automatically update every 30 seconds
- **Manual Refresh**: Click "Refresh" button to update immediately
- **View Details**: Click "View Details" on any agent to see full performance history

### Understanding Performance Scores

The performance score (0-100) is calculated based on:
- **Engagement Metrics**: Likes, shares, retweets, comments, views
- **Conversion Metrics**: Purchases, signups, revenue generated
- **Reach Metrics**: Impressions, unique views

**Score Interpretation**:
- **90-100**: Exceptional - Keep doing what you're doing!
- **70-89**: Great - Strong performance
- **50-69**: Good - Room for improvement
- **30-49**: Fair - Consider adjusting strategy
- **0-29**: Poor - Needs immediate attention

### How Agents Learn

Agents automatically improve over time by:

1. **Tracking Performance**: Every action is monitored for engagement
2. **Pattern Recognition**: Successful patterns are identified and reinforced
3. **Adaptation**: Agents adjust their:
   - Posting times (to optimal hours)
   - Content topics (focus on what works)
   - Tone and style (based on audience response)

### Monitoring Best Practices

1. **Check Daily**: Review the dashboard once per day to spot trends
2. **Watch for Drops**: If an agent's recent average drops significantly, investigate
3. **Review Learnings**: Check "Best Performing Topics" to understand what resonates
4. **Compare Agents**: See which channels/agents are most effective

### API Access

You can also access agent data programmatically:

```bash
# Get all agent status
curl https://manifest.ink/.netlify/functions/marketing-agents/agent-status

# Get specific agent details
curl "https://manifest.ink/.netlify/functions/marketing-agents/agent-status?agentId=twitter-main&limit=100"
```

### Troubleshooting

**Dashboard shows "No agents configured"**:
- Agents need to be registered with the orchestrator
- Check that environment variables are set (e.g., `TWITTER_AGENT_ENABLED=true`)

**Agents show 0 actions**:
- Agents may not have posted yet
- Check if agents are enabled
- Verify API credentials are configured

**Performance scores are low**:
- This is normal for new agents - they need time to learn
- Review "Best Performing Topics" to see what's working
- Check if posting times align with optimal hours

### Next Steps

1. **Set Up Agents**: Configure API credentials for each channel
2. **Enable Agents**: Set environment variables to enable agents
3. **Monitor Regularly**: Check dashboard daily for first week
4. **Review Learnings**: After 1-2 weeks, review what agents have learned
5. **Optimize**: Use insights to refine agent configurations

### Support

For issues or questions:
- Check agent logs in Netlify function logs
- Review environment variables
- Verify API credentials are valid
