## What is ERS?

ERS (Errand Runners System) is an on-demand platform that lets people
outsource everyday tasks to nearby runners — safely, transparently,
and without upfront payment.

Think: “Uber, but for errands.”

## How ERS Works

1. A client creates an errand (pickup, delivery, task).
2. Nearby runners see the errand and accept it.
3. The runner completes the task.
4. Payment is captured after completion.
5. Admins monitor activity, payouts, and disputes in real time.

## Who ERS Is For

- **Busy individuals** who need errands handled fast
- **Runners** looking to earn flexibly
- **Operations teams** managing logistics at scale

## Why ERS Exists

Urban life is busy. Small tasks waste time.
ERS turns idle movement into useful work.

## Engineering Overview (For Developers)

ERS is built as a modular monorepo with:
- A Node.js backend (Express)
- Supabase for data and realtime
- JWT-based authentication
- Role-based access control

Client App → Backend → Runner App
                 ↓
              Admin Dashboard

What ERS Is

ERS (Errand Runners System) is a real-world logistics platform designed to help people outsource everyday tasks to nearby runners—reliably and transparently.

A task execution platform, not just a delivery app

Built for dense urban environments like Lagos

Designed with real operational constraints in mind (payments, retries, monitoring, admin oversight)

Infrastructure-first: auth, roles, lifecycle states, observability come before polish

Actively being built and shipped in public, with production realism

In short: ERS turns everyday errands into a structured, trackable system.

What ERS Isn’t

ERS is intentionally not:

❌ A demo app or tutorial project

❌ A UI-first prototype with no backend depth

❌ A “clone” built for hype or pitch decks

❌ A finished consumer product (yet)

❌ Optimized for growth hacks over system correctness

ERS prioritizes correctness, reliability, and learning-by-building over shortcuts.