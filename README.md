# n8n-nodes-reportei

This is an n8n community node. It lets you use **Reportei** in your n8n workflows.

**Reportei** is a reporting and dashboard platform that helps you generate marketing reports, track timelines, and automate analytics. With this node, you can create reports, dashboards, and timeline events, as well as trigger workflows on various events happening in your Reportei account.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Once installed, you can select **Reportei** and **Reportei Trigger** in your n8n workflows to interact with the Reportei API.

## Operations

The **Reportei** node offers the following _actions_ (operations):

- **Create Report**: Create a marketing report, specifying the project, integrations, date ranges, titles, and optionally select a template.  
- **Create Dashboard**: Create a custom dashboard linked to a project, with selected integrations, date ranges, and optionally select a template.  
- **Add Event to Timeline**: Insert a milestone or note into a project’s report timeline.

The **Reportei Trigger** node supports these _events_ (webhooks):

- **Report Created**  
- **Dashboard Created**  
- **Automation Executed**  
- **Control Goal Met**  
- **Control Goal Not Met**  
- **Timeline Milestone Added**

## Credentials

To use this node, you need a **Reportei API** token (Bearer token).  
1. **Get your token** from the Reportei account page.  
2. In n8n, create a new credential called **Reportei API** and paste your token.  
3. Use this credential in the **Reportei** or **Reportei Trigger** node.

For webhooks, the node will automatically register or unregister a webhook subscription in your Reportei account if you use the **Reportei Trigger** node. You only need to provide valid credentials and set the correct event type.

## Compatibility

- **Minimum n8n version**: 1.85.0 (or whichever you have tested).  
- The node is developed and tested against **Reportei**’s [API v1](https://app.reportei.com/docs/api).  
- No known incompatibilities, but you must enable **community nodes** in n8n’s settings for installation.

## Usage

1. In your n8n instance, install the node via one of the methods described in the community nodes [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).  
2. Create or select a credential for **Reportei API**.  
3. **Actions** node (Reportei):
   - Drag the **Reportei** node into your workflow.  
   - Select your resource (Report, Dashboard, or Timeline) and the operation (create).  
   - Fill the required fields, such as “Project ID”, “Integrations”, “Title”, etc.  
   - Execute the workflow to see the results.
4. **Trigger** node (Reportei Trigger):
   - Drag the **Reportei Trigger** node into your workflow.  
   - Choose an event type (e.g., “report_created”).  
   - (Optional) If you are running n8n locally or behind a tunnel, fill **Custom Webhook Base URL** with your public domain (for example, `https://your-domain.tld`). This replaces the default localhost address in the webhook registration, ensuring external services (Reportei) can reach your n8n instance.  
   - Activate the workflow. The node will register a webhook at Reportei.  
   - Once the event occurs, n8n will receive a POST request at your specified domain and trigger your workflow.

If you need more help with n8n basics, check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)  
- [Reportei API documentation](https://app.reportei.com/docs/api)  
- [n8n official docs](https://docs.n8n.io/)

## Version history

- **0.1.0**  
  - Initial release of the **n8n-nodes-reportei** package.  
  - Added actions: Create Report, Create Dashboard, Add Timeline Event.  
  - Added triggers for 6 events: `report_created`, `dashboard_created`, `automation_executed`, `control_goal_met`, `control_goal_not_met`, `timeline_milestone`.

- **0.1.1**  
  - Fixed minor bugs in the existing operations and triggers.

- **0.1.2**  
  - Added the optional **Custom Webhook Base URL** input in the trigger node.  
  - Users can now specify a public domain (such as a tunnel URL) to replace localhost, making it easier to receive events behind NAT or local environments.

- **0.1.3**  
  - **NEW**: Added optional **Template Selection** for Reports and Dashboards.  
  - Templates are now loaded dynamically based on the selected project.  
  - Enhanced API endpoint handling with multiple fallback URLs for better reliability.  
  - Improved error handling for template loading operations.
