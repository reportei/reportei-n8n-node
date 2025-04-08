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

- **Create Report**: Create a marketing report, specifying the project, integrations, date ranges, and titles.  
- **Create Dashboard**: Create a custom dashboard linked to a project, with selected integrations and date ranges.  
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
   - Activate the workflow. The node will register a webhook at Reportei.  
   - Once the event occurs, n8n will receive a POST request and trigger your workflow.

If you need more help with n8n basics, check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)  
* [Reportei API documentation](https://app.reportei.com/docs/api)  
* [n8n official docs](https://docs.n8n.io/)

## Version history

**0.1.0**  
- Initial release of the **n8n-nodes-reportei** package.  
- Added actions: Create Report, Create Dashboard, Add Timeline Event.  
- Added triggers for 6 events: report_created, dashboard_created, automation_executed, control_goal_met, control_goal_not_met, and timeline_milestone.

---