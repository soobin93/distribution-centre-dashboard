# Emergency Services Infrastructure Dashboard (Mock)

An executive-facing **mock dashboard** designed to demonstrate how large-scale capital infrastructure projects can be tracked and reported in a single system.

This project presents a **visual concept** for moving away from spreadsheet-based reporting by providing a centralised, structured view of project delivery data.

All data in this repository is **synthetic** and used for demonstration purposes only.

---

## Context

The dashboard is modelled around a capital infrastructure program delivering **Emergency Services Infrastructure** across multiple locations, including:
- North Brisbane
- South Brisbane

The primary audience is **executives and senior stakeholders** who require clear, high-level visibility across multiple projects.

---

## Key Capabilities (Conceptual)

- Central repository for project documentation  
  (construction plans, approvals, project artefacts)
- Single source of truth for reporting
- Project-level visibility into:
  - Budget
  - Progress against milestones
  - Risks
  - RFIs (Requests for Information)
  - Photo-based progress updates
- Cross-project summary view for overall program status

---

## Architecture Overview

This repository uses a **mono-repo** structure:

- **Backend**: Django + Django REST Framework  
  Focused on domain modelling, workflows, approvals, and auditability.
- **Frontend**: React (Vite)  
  A thin client for visualising and interacting with backend data.

Frontend and backend are designed to be **independently deployable**, reflecting common real-world delivery patterns.

---

## Design Principles

- Clarity over completeness
- Realistic domain modelling
- Separation of concerns
- Executive-level readability
- Portfolio-quality structure suitable for technical review

---

## Disclaimer

This project is a **mock implementation** created for demonstration and portfolio purposes.  
It is not affiliated with any real organisation, infrastructure program, or operational system.
