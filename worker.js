/**
 * Demand Intelligence AI Agent — Cloudflare Worker
 * Proxy per Groq API — la API key non è mai esposta al browser
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

// Demand portfolio — dataset completo
const DEMAND_DATA = {
  "demands": [
    {"id":"DM-001","title":"Dynamic Beam Capacity Allocation API","status":"Implementation & Testing","priority":"Critical","owner":"Marco Rossi","requestor":"StarConnect Ltd","created_at":"2025-01-15","updated_at":"2025-05-20","target_rollout":"2025-07-01","description":"Development of a REST API enabling external clients to dynamically reallocate contracted MHz capacity across satellite beams in near real-time. End-to-end execution within 15 minutes.","business_requirements":"BR-01: Dynamic redistribution of contracted MHz across beam groups. BR-02: REST/JSON API for external clients. BR-03: Zero manual processing. BR-04: 15-minute execution SLA. BR-05: Contract-based capacity limits.","jira_epic":"DSAT-100","linked_documents":["DM-001_Mission_Brief_v2.1.pptx","DM-001_FRD_v1.3.docx"],"last_meeting":"2025-05-15","open_actions":[{"action":"Complete API layer implementation","owner":"L. Bianchi","due":"2025-05-30"},{"action":"Execute integration test suite with Planning System","owner":"S. Chen","due":"2025-06-05"}],"risks":["Planning System API stability under load","Third-party Frequency Planning System response time"],"notes":"Phase 3.4 of the Flexible MHz programme. Design review approved 10 May 2025."},
    {"id":"DM-002","title":"Customer Portal — Self-Service Bandwidth Management","status":"Design","priority":"High","owner":"Francesca Marino","requestor":"OceanSat Services","created_at":"2025-02-03","updated_at":"2025-05-18","target_rollout":"2025-09-15","description":"Web portal enabling enterprise customers to visualise and manage satellite bandwidth allocations in real time without contacting operations.","business_requirements":"BR-01: Real-time bandwidth visibility per beam. BR-02: Self-service reallocation requests. BR-03: BSS/OSS integration. BR-04: Role-based access. BR-05: Exportable usage reports.","jira_epic":"DSAT-200","linked_documents":["DM-002_Mission_Brief_v1.0.pptx","DM-002_BRD_v1.1.docx"],"last_meeting":"2025-05-12","open_actions":[{"action":"Finalise UX wireframes for reallocation workflow","owner":"F. Marino","due":"2025-05-28"},{"action":"Confirm BSS/OSS API specification","owner":"M. Rossi","due":"2025-06-01"}],"risks":["BSS/OSS API availability","Customer onboarding complexity"],"notes":"Stakeholder review scheduled 2 June 2025."},
    {"id":"DM-003","title":"Automated SLA Monitoring & Alerting System","status":"Roll-out","priority":"Critical","owner":"Luca Bianchi","requestor":"Internal — Operations","created_at":"2024-10-01","updated_at":"2025-05-19","target_rollout":"2025-06-01","description":"Automated real-time SLA monitoring across all active satellite services with alerting and automated incident reports.","business_requirements":"BR-01: Monitor latency, availability, throughput KPIs. BR-02: Alerts within 2 minutes of SLA breach. BR-03: Automated incident reports. BR-04: NMS and ticketing integration. BR-05: Executive SLA compliance dashboard.","jira_epic":"DSAT-300","linked_documents":["DM-003_Mission_Brief_v3.0.pptx","DM-003_Runbook_v1.0.docx"],"last_meeting":"2025-05-16","open_actions":[{"action":"Complete production environment smoke test","owner":"L. Bianchi","due":"2025-05-25"},{"action":"Train operations team on alert management console","owner":"A. Ferrari","due":"2025-05-28"}],"risks":["NMS integration stability during cutover","Alert fatigue if thresholds not calibrated"],"notes":"Go-live 1 June 2025. 4-week hypercare post go-live."},
    {"id":"DM-004","title":"LEO/GEO Hybrid Network Orchestration","status":"Shaping","priority":"High","owner":"Sofia Chen","requestor":"AeroLink Aviation","created_at":"2025-04-20","updated_at":"2025-05-10","target_rollout":"2026-03-01","description":"Orchestration layer for seamless handover and load balancing between LEO and GEO satellite constellations for aviation customers.","business_requirements":"BR-01: Automatic LEO/GEO handover within 500ms. BR-02: Service continuity during transitions. BR-03: Optimised routing by latency, cost, availability. BR-04: Support 500 concurrent aircraft sessions.","jira_epic":null,"linked_documents":["DM-004_Concept_Note_v0.1.docx"],"last_meeting":"2025-05-08","open_actions":[{"action":"Complete feasibility assessment for LEO handover latency","owner":"S. Chen","due":"2025-06-15"},{"action":"Engage AeroLink for requirements workshop","owner":"F. Marino","due":"2025-06-10"}],"risks":["LEO constellation API availability","Regulatory approval for aviation-grade LEO services"],"notes":"Early shaping. Concept note under Architecture Board review."},
    {"id":"DM-005","title":"Maritime Connectivity Quality Dashboard","status":"High Level Assessment","priority":"Medium","owner":"Alberto Pavani","requestor":"BlueSea Maritime","created_at":"2025-03-10","updated_at":"2025-05-14","target_rollout":"2025-11-01","description":"Real-time dashboard for maritime operators showing connectivity quality metrics per vessel — signal strength, latency, throughput, beam handover events.","business_requirements":"BR-01: Real-time KPIs per vessel on map. BR-02: Historical trend analysis 30/90 days. BR-03: Connectivity degradation alerts. BR-04: PDF and CSV report export.","jira_epic":null,"linked_documents":["DM-005_HLA_Report_v1.0.docx"],"last_meeting":"2025-05-13","open_actions":[{"action":"Assess NMS data availability for vessel-level metrics","owner":"A. Pavani","due":"2025-06-01"},{"action":"Present HLA findings to BlueSea steering committee","owner":"A. Pavani","due":"2025-06-20"}],"risks":["NMS data granularity for vessel-level metrics","GDPR compliance for vessel location data"],"notes":"HLA in progress. Architecture options under evaluation."},
    {"id":"DM-006","title":"In-Flight Entertainment Bandwidth Optimizer","status":"Design","priority":"High","owner":"Marco Rossi","requestor":"SkyJet Airlines","created_at":"2025-02-28","updated_at":"2025-05-17","target_rollout":"2025-10-01","description":"AI-driven bandwidth optimization engine for in-flight entertainment. Dynamically allocates bandwidth across passenger services based on demand and QoS policies.","business_requirements":"BR-01: Dynamic bandwidth allocation by real-time demand. BR-02: QoS policy enforcement (safety > crew > premium > standard). BR-03: Reduce passenger complaints by 40%. BR-04: IFE system API integration.","jira_epic":"DSAT-600","linked_documents":["DM-006_Mission_Brief_v1.2.pptx","DM-006_Technical_Design_v0.9.docx"],"last_meeting":"2025-05-14","open_actions":[{"action":"Finalise QoS policy matrix with SkyJet","owner":"M. Rossi","due":"2025-05-31"},{"action":"Review AI model training dataset requirements","owner":"S. Chen","due":"2025-06-07"}],"risks":["IFE system API documentation incomplete","AI model accuracy in low-bandwidth edge cases"],"notes":"Technical design review scheduled 28 May 2025."},
    {"id":"DM-007","title":"BSS/OSS Integration — Real-time Provisioning","status":"Closure","priority":"High","owner":"Francesca Marino","requestor":"Internal — Engineering","created_at":"2024-07-01","updated_at":"2025-05-05","target_rollout":"2025-04-01","description":"Integration of BSS and OSS platforms for real-time automated service provisioning. Reduced time-to-service from 4 hours to under 10 minutes.","business_requirements":"BR-01: Automated provisioning from BSS order events. BR-02: Provisioning time under 10 minutes. BR-03: Real-time status to customer-facing systems. BR-04: Rollback on failure.","jira_epic":"DSAT-700","linked_documents":["DM-007_Closure_Report_v1.0.docx","DM-007_Lessons_Learned.docx"],"last_meeting":"2025-04-28","open_actions":[{"action":"Complete post-implementation review document","owner":"F. Marino","due":"2025-05-31"},{"action":"Archive all project artefacts to SharePoint","owner":"F. Marino","due":"2025-05-31"}],"risks":[],"notes":"Successfully delivered. Provisioning time 8 minutes average. Closure report in final review."},
    {"id":"DM-008","title":"Satellite Ground Station Redundancy Framework","status":"Shaping","priority":"Critical","owner":"Luca Bianchi","requestor":"Internal — Infrastructure","created_at":"2025-05-01","updated_at":"2025-05-20","target_rollout":"2026-06-01","description":"Geographic redundancy framework for satellite ground stations with automatic failover within 60 seconds ensuring service continuity for all active customers.","business_requirements":"BR-01: Automatic failover within 60 seconds. BR-02: 99.99% service availability. BR-03: Active-active and active-passive configurations. BR-04: Zero customer impact during maintenance.","jira_epic":null,"linked_documents":["DM-008_Initial_Brief_v0.1.docx"],"last_meeting":"2025-05-19","open_actions":[{"action":"Identify candidate secondary ground station locations","owner":"L. Bianchi","due":"2025-06-15"},{"action":"Define RTO and RPO requirements","owner":"L. Bianchi","due":"2025-06-10"}],"risks":["Geographic constraints for secondary station","Budget approval for infrastructure investment"],"notes":"Critical infrastructure initiative. Executive sponsorship confirmed."},
    {"id":"DM-009","title":"Enterprise VSAT Remote Monitoring Platform","status":"Implementation & Testing","priority":"High","owner":"Sofia Chen","requestor":"GlobalCorp Enterprise","created_at":"2025-01-20","updated_at":"2025-05-21","target_rollout":"2025-08-01","description":"Centralised remote monitoring for GlobalCorp's 200+ VSAT terminals across remote enterprise sites. NOC visibility, predictive maintenance, automated fault resolution.","business_requirements":"BR-01: Monitor 200+ VSAT terminals from single NOC dashboard. BR-02: Fault alerts within 5 minutes. BR-03: Predictive maintenance from signal degradation trends. BR-04: Automated remote reboot for Tier-1 faults.","jira_epic":"DSAT-900","linked_documents":["DM-009_Mission_Brief_v2.0.pptx","DM-009_Technical_Spec_v1.1.docx"],"last_meeting":"2025-05-20","open_actions":[{"action":"Complete load testing for 200 concurrent terminal connections","owner":"S. Chen","due":"2025-06-03"},{"action":"Resolve SNMP polling timeout on legacy terminals","owner":"A. Ferrari","due":"2025-05-27"}],"risks":["Legacy terminal SNMP compatibility","Network latency on real-time monitoring accuracy"],"notes":"Integration testing 80% complete. UAT with GlobalCorp scheduled 15 June 2025."},
    {"id":"DM-010","title":"5G Backhaul via Satellite — Feasibility Study","status":"High Level Assessment","priority":"Medium","owner":"Alberto Pavani","requestor":"TowerNet Telecom","created_at":"2025-03-25","updated_at":"2025-05-16","target_rollout":"2026-01-01","description":"Feasibility study for 5G backhaul via satellite for TowerNet's rural tower network. Evaluates technical viability, latency, capacity requirements, and commercial model.","business_requirements":"BR-01: Assess 5G backhaul viability for latency-sensitive applications. BR-02: Define capacity requirements per tower. BR-03: Evaluate LEO vs GEO options. BR-04: Commercial model recommendations.","jira_epic":null,"linked_documents":["DM-010_Feasibility_Brief_v0.2.docx"],"last_meeting":"2025-05-15","open_actions":[{"action":"Complete latency benchmark analysis for LEO 5G backhaul","owner":"A. Pavani","due":"2025-06-20"},{"action":"Engage TowerNet for traffic model data sharing","owner":"F. Marino","due":"2025-06-05"}],"risks":["5G latency requirements may exceed GEO capabilities","TowerNet budget constraints for LEO premium pricing"],"notes":"Feasibility study phase. Results expected end of June 2025."}
  ],
  "metadata": {
    "total_demands": 10,
    "last_updated": "2025-05-21",
    "portfolio_summary": {"Shaping":2,"High Level Assessment":2,"Design":2,"Implementation & Testing":2,"Roll-out":1,"Closure":1},
    "owners": ["Marco Rossi","Francesca Marino","Luca Bianchi","Sofia Chen","Alberto Pavani"],
    "priorities": {"Critical":3,"High":5,"Medium":2}
  }
};

// Jira tickets
const JIRA_DATA = {
  "tickets": [
    {"key":"DSAT-101","demand_id":"DM-001","summary":"Implement POST /v1/capacity/requests endpoint","status":"In Progress","assignee":"Luca Bianchi","sprint":"Sprint 14","priority":"High","story_points":8},
    {"key":"DSAT-102","demand_id":"DM-001","summary":"Implement contract validation engine","status":"Done","assignee":"Sofia Chen","sprint":"Sprint 13","priority":"High","story_points":5},
    {"key":"DSAT-103","demand_id":"DM-001","summary":"Integration test suite — Planning System","status":"To Do","assignee":"Sofia Chen","sprint":"Sprint 14","priority":"High","story_points":5},
    {"key":"DSAT-104","demand_id":"DM-001","summary":"Rollback mechanism implementation","status":"In Progress","assignee":"Luca Bianchi","sprint":"Sprint 14","priority":"Critical","story_points":8},
    {"key":"DSAT-105","demand_id":"DM-001","summary":"API authentication — OAuth 2.0","status":"Done","assignee":"Marco Rossi","sprint":"Sprint 12","priority":"Critical","story_points":3},
    {"key":"DSAT-201","demand_id":"DM-002","summary":"UX wireframes — reallocation workflow","status":"In Progress","assignee":"Francesca Marino","sprint":"Sprint 14","priority":"High","story_points":5},
    {"key":"DSAT-202","demand_id":"DM-002","summary":"BSS/OSS API contract data feed spec","status":"To Do","assignee":"Marco Rossi","sprint":"Sprint 15","priority":"High","story_points":3},
    {"key":"DSAT-601","demand_id":"DM-006","summary":"QoS policy engine — core logic","status":"In Progress","assignee":"Marco Rossi","sprint":"Sprint 14","priority":"High","story_points":13},
    {"key":"DSAT-602","demand_id":"DM-006","summary":"IFE system API connector","status":"To Do","assignee":"Sofia Chen","sprint":"Sprint 15","priority":"High","story_points":8},
    {"key":"DSAT-901","demand_id":"DM-009","summary":"NOC dashboard — terminal monitoring view","status":"Done","assignee":"Sofia Chen","sprint":"Sprint 13","priority":"High","story_points":8},
    {"key":"DSAT-902","demand_id":"DM-009","summary":"Load testing — 200 concurrent terminals","status":"In Progress","assignee":"Sofia Chen","sprint":"Sprint 14","priority":"Critical","story_points":5},
    {"key":"DSAT-903","demand_id":"DM-009","summary":"Fix SNMP polling timeout on legacy terminals","status":"In Progress","assignee":"Alessandro Ferrari","sprint":"Sprint 14","priority":"Critical","story_points":3},
    {"key":"DSAT-904","demand_id":"DM-009","summary":"Predictive maintenance alert engine","status":"Done","assignee":"Sofia Chen","sprint":"Sprint 13","priority":"High","story_points":13}
  ]
};

// Meeting minutes
const MEETING_MINUTES = [
  {
    "id":"MTG-001","demand_id":"DM-001","date":"2025-05-15",
    "title":"DM-001 Weekly Status — Sprint 14 Review",
    "attendees":["Marco Rossi","Luca Bianchi","Sofia Chen","StarConnect representative"],
    "decisions":["Design review formally approved. No further scope changes permitted before go-live.","API rate limiting set at 100 requests/minute per client — approved by StarConnect.","Go-live date confirmed: 1 July 2025."],
    "action_items":[{"action":"Complete API layer implementation (DSAT-101)","owner":"Luca Bianchi","due":"2025-05-30"},{"action":"Execute integration test suite with Planning System (DSAT-103)","owner":"Sofia Chen","due":"2025-06-05"},{"action":"Prepare go-live runbook","owner":"Marco Rossi","due":"2025-06-15"}],
    "risks_discussed":["Planning System API showed intermittent timeouts in staging — monitoring closely. No blocker at this stage."]
  },
  {
    "id":"MTG-002","demand_id":"DM-002","date":"2025-05-12",
    "title":"DM-002 Design Checkpoint — UX Review",
    "attendees":["Francesca Marino","Marco Rossi","OceanSat product team"],
    "decisions":["UX prototype approved by OceanSat with minor feedback on the alert notification design.","BSS/OSS integration will use polling (every 5 minutes) as real-time webhook not available in current BSS version.","Target rollout confirmed: 15 September 2025."],
    "action_items":[{"action":"Incorporate OceanSat UX feedback into wireframes v2","owner":"Francesca Marino","due":"2025-05-28"},{"action":"Confirm BSS/OSS polling API specification","owner":"Marco Rossi","due":"2025-06-01"}],
    "risks_discussed":["BSS polling latency may impact dashboard freshness — acceptable for current phase, to be reviewed in Phase 2."]
  },
  {
    "id":"MTG-003","demand_id":"DM-009","date":"2025-05-20",
    "title":"DM-009 Integration Testing Review",
    "attendees":["Sofia Chen","Alessandro Ferrari","GlobalCorp NOC team"],
    "decisions":["Load testing scope confirmed: 200 concurrent terminals, 72-hour sustained test.","SNMP timeout issue on legacy terminals classified as P1 blocker — must be resolved before UAT.","UAT with GlobalCorp scheduled: 15 June 2025."],
    "action_items":[{"action":"Resolve SNMP timeout on legacy terminals (DSAT-903)","owner":"Alessandro Ferrari","due":"2025-05-27"},{"action":"Complete 200-terminal load test (DSAT-902)","owner":"Sofia Chen","due":"2025-06-03"},{"action":"Prepare UAT test plan for GlobalCorp","owner":"Sofia Chen","due":"2025-06-08"}],
    "risks_discussed":["If SNMP issue not resolved by 27 May, UAT date at risk. Escalation path: Marco Rossi."]
  }
];

// System prompt
function buildSystemPrompt(role) {
  const roleContext = {
    executive: "You are responding to an Executive. Provide high-level portfolio summaries, risk highlights, and strategic insights. Be concise and focus on business impact.",
    demand_manager: "You are responding to a Demand Manager. Provide operational details, action items, meeting decisions, and document references. Be thorough and precise.",
    developer: "You are responding to a Developer or Project Manager. Focus on Jira tickets, technical requirements, sprint status, blockers, and implementation details.",
    stakeholder: "You are responding to a Business Stakeholder. Show only their relevant demands. Focus on status, timeline, next steps, and available documents.",
    default: "You are responding to a team member. Be helpful, precise, and always cite your sources."
  };

  // Build compact context based on role to minimise tokens
  var demandSummary = DEMAND_DATA.demands.map(function(d) {
    return {
      id: d.id, title: d.title, status: d.status, priority: d.priority,
      owner: d.owner, requestor: d.requestor, updated: d.updated_at,
      rollout: d.target_rollout, actions: d.open_actions, risks: d.risks,
      notes: d.notes, jira: d.jira_epic, docs: d.linked_documents,
      reqs: d.business_requirements ? d.business_requirements.substring(0,200) : ''
    };
  });

  var context = 'DEMAND PORTFOLIO (summary):\n' + JSON.stringify(demandSummary) + '\n\n';

  // Add Jira only for developer/demand_manager roles
  if (role === 'developer' || role === 'demand_manager') {
    context += 'JIRA TICKETS:\n' + JSON.stringify(JIRA_DATA.tickets) + '\n\n';
  }

  // Add meeting minutes only for demand_manager role
  if (role === 'demand_manager') {
    context += 'MEETING MINUTES:\n' + JSON.stringify(MEETING_MINUTES) + '\n\n';
  }

  // Add portfolio stats for executive
  if (role === 'executive') {
    context += 'PORTFOLIO STATS:\n' + JSON.stringify(DEMAND_DATA.metadata) + '\n\n';
  }

  return `You are the Demand Intelligence AI Assistant for a satellite telecommunications company.

${roleContext[role] || roleContext.default}

${context}
RULES:
- Always cite your source (e.g. "Per A-ah! as of 21 May 2025", "Per Jira Sprint 14", "Per Teams meeting 15 May")
- If information is not in the data provided, say so clearly — never invent
- For status queries include: stage, owner, target rollout, open actions
- Keep answers concise but complete
- Use bullet points for lists
- Today's date is 21 May 2025`;
}

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: corsHeaders()
      });
    }

    try {
      const body = await request.json();
      const { messages, role } = body;

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
          status: 400, headers: corsHeaders()
        });
      }

      const systemPrompt = buildSystemPrompt(role || 'default');

      const groqResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.3,
          max_tokens: 1024
        })
      });

      if (!groqResponse.ok) {
        const err = await groqResponse.text();
        return new Response(JSON.stringify({ error: 'Groq API error: ' + err }), {
          status: 502, headers: corsHeaders()
        });
      }

      const data = await groqResponse.json();
      const answer = data.choices?.[0]?.message?.content || 'No response generated.';

      return new Response(JSON.stringify({ answer }), { headers: corsHeaders() });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: corsHeaders()
      });
    }
  }
};
