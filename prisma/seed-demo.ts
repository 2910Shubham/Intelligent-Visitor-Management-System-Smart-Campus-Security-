/**
 * Demo Data Seed Script
 *
 * Populates the database AND Redis with realistic demo data:
 * - 10 visitors with different statuses
 * - 4 CHECKED_IN  (visible on guard dashboard)
 * - 3 OVERSTAYED  (visible + amber warning)
 * - 3 CHECKED_OUT (completed visits)
 *
 * Usage:
 *   npx tsx prisma/seed-demo.ts
 */
import { PrismaClient, VisitStatus } from "@prisma/client";
import { Redis } from "@upstash/redis";

const prisma = new PrismaClient();
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ACTIVE_SET = "active-visitors";

const now = new Date();
const hours = (h: number) => h * 60 * 60 * 1000;
const mins = (m: number) => m * 60 * 1000;

// ── 10 Demo Visitors ───────────────────────────────────────
const VISITORS = [
  // CHECKED_IN — currently inside
  { name: "Aarav Mehta",     email: "aarav.mehta@demo.com",     phone: "+91-9000000001", status: "CHECKED_IN" as VisitStatus,  purpose: "Project Discussion",    inAgo: mins(45),   outIn: hours(2) },
  { name: "Sneha Reddy",    email: "sneha.reddy@demo.com",     phone: "+91-9000000002", status: "CHECKED_IN" as VisitStatus,  purpose: "Campus Tour",           inAgo: mins(20),   outIn: hours(3) },
  { name: "Kabir Singh",    email: "kabir.singh@demo.com",     phone: "+91-9000000003", status: "CHECKED_IN" as VisitStatus,  purpose: "Interview",             inAgo: mins(90),   outIn: hours(1) },
  { name: "Diya Sharma",    email: "diya.sharma@demo.com",     phone: "+91-9000000004", status: "CHECKED_IN" as VisitStatus,  purpose: "Guest Lecture",          inAgo: mins(10),   outIn: hours(4) },

  // OVERSTAYED — past their expected checkout
  { name: "Rohan Patel",    email: "rohan.patel@demo.com",     phone: "+91-9000000005", status: "OVERSTAYED" as VisitStatus,  purpose: "Lab Visit",             inAgo: hours(4),   outIn: -hours(1) },
  { name: "Ananya Gupta",   email: "ananya.gupta@demo.com",    phone: "+91-9000000006", status: "OVERSTAYED" as VisitStatus,  purpose: "Document Submission",   inAgo: hours(5),   outIn: -hours(2) },
  { name: "Vivaan Kumar",   email: "vivaan.kumar@demo.com",    phone: "+91-9000000007", status: "OVERSTAYED" as VisitStatus,  purpose: "Meeting",               inAgo: hours(3),   outIn: -mins(30) },

  // CHECKED_OUT — completed visits
  { name: "Ishita Jain",    email: "ishita.jain@demo.com",     phone: "+91-9000000008", status: "CHECKED_OUT" as VisitStatus, purpose: "Library Access",        inAgo: hours(6),   outIn: -hours(4) },
  { name: "Arjun Nair",     email: "arjun.nair@demo.com",      phone: "+91-9000000009", status: "CHECKED_OUT" as VisitStatus, purpose: "Project Discussion",    inAgo: hours(8),   outIn: -hours(5) },
  { name: "Meera Iyer",     email: "meera.iyer@demo.com",      phone: "+91-9000000010", status: "CHECKED_OUT" as VisitStatus, purpose: "Guest Lecture",          inAgo: hours(24),  outIn: -hours(22) },
];

async function main() {
  console.log("🎬 Seeding demo data...\n");

  // ── Get existing hosts ──
  const hosts = await prisma.host.findMany();
  if (hosts.length === 0) {
    console.error("❌ No hosts found. Run the main seed first: npx prisma db seed");
    process.exit(1);
  }

  // ── Get existing gates ──
  const gates = await prisma.gate.findMany({ where: { isActive: true } });

  // ── Clear old Redis active set ──
  await redis.del(ACTIVE_SET);
  console.log("🧹 Cleared Redis active-visitors set");

  // ── Create visitors and visits ──
  let checkedIn = 0, overstayed = 0, checkedOut = 0;

  for (const v of VISITORS) {
    // Upsert visitor
    const visitor = await prisma.visitor.upsert({
      where: { email: v.email },
      update: { fullName: v.name, phone: v.phone },
      create: { fullName: v.name, email: v.email, phone: v.phone },
    });

    // Pick a random host and gate
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    const gate = gates[Math.floor(Math.random() * gates.length)];

    // Calculate timestamps
    const checkedInAt = new Date(now.getTime() - v.inAgo);
    const expectedOut = new Date(now.getTime() + v.outIn);
    const scheduledAt = new Date(checkedInAt.getTime() - mins(30)); // scheduled 30min before check-in

    // Build visit data
    const visitData: Record<string, unknown> = {
      visitorId: visitor.id,
      hostId: host.id,
      gateId: gate.id,
      purpose: v.purpose,
      status: v.status,
      otp: String(100000 + Math.floor(Math.random() * 900000)),
      scheduledAt,
      checkedInAt,
      expectedOut,
    };

    // Add checkout time for completed visits
    if (v.status === "CHECKED_OUT") {
      visitData.checkedOutAt = new Date(expectedOut.getTime() + mins(15));
    }

    // Delete any existing demo visits for this visitor
    await prisma.visit.deleteMany({
      where: {
        visitorId: visitor.id,
        purpose: v.purpose,
      },
    });

    // Create visit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visit = await prisma.visit.create({ data: visitData as any });

    // Add to Redis active set if currently inside
    if (v.status === "CHECKED_IN" || v.status === "OVERSTAYED") {
      await redis.sadd(ACTIVE_SET, visitor.id);
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        visitId: visit.id,
        action: "CHECKED_IN",
        actorId: "demo-seed",
        metadata: {
          method: "qr-scan",
          gate: gate.name,
          checkedInAt: checkedInAt.toISOString(),
        },
      },
    });

    if (v.status === "CHECKED_OUT") {
      await prisma.auditLog.create({
        data: {
          visitId: visit.id,
          action: "CHECKED_OUT",
          actorId: "demo-seed",
          metadata: { checkedOutAt: (visitData.checkedOutAt as Date).toISOString() },
        },
      });
    }

    if (v.status === "OVERSTAYED") {
      await prisma.auditLog.create({
        data: {
          visitId: visit.id,
          action: "OVERSTAYED",
          actorId: "cron-system",
          metadata: { expectedOut: expectedOut.toISOString(), detectedAt: now.toISOString() },
        },
      });
    }

    const icon =
      v.status === "CHECKED_IN" ? "🟢" :
      v.status === "OVERSTAYED" ? "🟠" : "⚪";

    console.log(`${icon} ${v.name.padEnd(18)} → ${v.status.padEnd(12)} | ${v.purpose}`);

    if (v.status === "CHECKED_IN") checkedIn++;
    if (v.status === "OVERSTAYED") overstayed++;
    if (v.status === "CHECKED_OUT") checkedOut++;
  }

  // ── Verify Redis ──
  const activeIds = await redis.smembers(ACTIVE_SET);

  console.log(`
╔════════════════════════════════════════╗
║          DEMO SEED COMPLETE            ║
╠════════════════════════════════════════╣
║  🟢 Checked In:   ${String(checkedIn).padEnd(20)}║
║  🟠 Overstayed:   ${String(overstayed).padEnd(20)}║
║  ⚪ Checked Out:  ${String(checkedOut).padEnd(20)}║
║  📊 Redis Active: ${String(activeIds.length).padEnd(20)}║
╚════════════════════════════════════════╝

Guard dashboard: http://localhost:3000/guard/dashboard
Login: guard1@campus.edu / guard@123
`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Demo seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
