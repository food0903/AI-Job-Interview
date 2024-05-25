import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';

const projectId = "siliconxhacks2024";
const firestorePort = 8080;
const firestoreHost = "localhost";
const coverageUrl = `http://${firestoreHost}:${firestorePort}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

// Load Firestore rules
const rules = fs.readFileSync("firestore.rules", "utf8");

let testEnv;

before(async () => {
  // Initialize the testing environment
  testEnv = await initializeTestEnvironment({
    projectId: projectId,
    firestore: {
      host: firestoreHost,
      port: firestorePort,
      rules: rules,
    },
  });

  // Apply Firestore rules
  await testEnv.clearFirestore();

  // Create initial documents
  const alice = testEnv.authenticatedContext("alice");
  const bob = testEnv.authenticatedContext("bob");

  const aliceMessageRef = alice.firestore().collection("messages").doc("aliceMessage");
  const bobMessageRef = bob.firestore().collection("messages").doc("bobMessage");
  const aliceFeedbackRef = alice.firestore().collection("feedback").doc("aliceFeedback");
  const bobFeedbackRef = bob.firestore().collection("feedback").doc("bobFeedback");
  const aliceSessionRef = alice.firestore().collection("sessions").doc("aliceSession");
  const bobSessionRef = bob.firestore().collection("sessions").doc("bobSession");

  await assertSucceeds(aliceMessageRef.set({ content: "Hello from Alice", uid: "alice" }));
  await assertSucceeds(bobMessageRef.set({ content: "Hello from Bob", uid: "bob" }));
  await assertSucceeds(aliceFeedbackRef.set({ feedback: "Great job!", uid: "alice" }));
  await assertSucceeds(bobFeedbackRef.set({ feedback: "Nice work!", uid: "bob" }));
  await assertSucceeds(aliceSessionRef.set({ sessionData: "Alice's session", uid: "alice" }));
  await assertSucceeds(bobSessionRef.set({ sessionData: "Bob's session", uid: "bob" }));
});

after(async () => {
  // Generate and print security rules coverage report
  console.log(`View the rule coverage information at ${coverageUrl}`);

  // Clean up and exit
  await testEnv.cleanup();
  console.log("\nTest environment cleaned up");
});

describe("Firestore Security Rules", () => {
  describe("Feedback Collection Tests", () => {
    it("Alice can read her own feedback", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const aliceFeedbackRef = alice.firestore().collection("feedback").doc("aliceFeedback");
      await assertSucceeds(aliceFeedbackRef.get());
    });

    it("Bob cannot read Alice's feedback", async () => {
      const bob = testEnv.authenticatedContext("bob");
      const aliceFeedbackRef = bob.firestore().collection("feedback").doc("aliceFeedback");
      await assertFails(aliceFeedbackRef.get());
    });

    it("Alice cannot update her own feedback", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const aliceFeedbackRef = alice.firestore().collection("feedback").doc("aliceFeedback");
      await assertFails(aliceFeedbackRef.update({ feedback: "Updated feedback" }));
    });

    it("Alice cannot read Bob's feedback", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const bobFeedbackRef = alice.firestore().collection("feedback").doc("bobFeedback");
      await assertFails(bobFeedbackRef.get());
    });
  });

  describe("Sessions Collection Tests", () => {
    it("Bob can read his own session", async () => {
      const bob = testEnv.authenticatedContext("bob");
      const bobSessionRef = bob.firestore().collection("sessions").doc("bobSession");
      await assertSucceeds(bobSessionRef.get());
    });

    it("Alice cannot read Bob's session", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const bobSessionRef = alice.firestore().collection("sessions").doc("bobSession");
      await assertFails(bobSessionRef.get());
    });

    it("Bob can update his own session", async () => {
      const bob = testEnv.authenticatedContext("bob");
      const bobSessionRef = bob.firestore().collection("sessions").doc("bobSession");
      await assertSucceeds(bobSessionRef.update({ sessionData: "Updated session data", uid: "bob" }));
    });
  });

  describe("Messages Collection Tests", () => {
    it("Alice can read her own message", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const aliceMessageRef = alice.firestore().collection("messages").doc("aliceMessage");
      await assertSucceeds(aliceMessageRef.get());
    });

    it("Alice can read Bob's message", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const bobMessageRef = alice.firestore().collection("messages").doc("bobMessage");
      await assertSucceeds(bobMessageRef.get());
    });

    it("Alice cannot update her own message content", async () => {
      const alice = testEnv.authenticatedContext("alice");
      const aliceMessageRef = alice.firestore().collection("messages").doc("aliceMessage");
      await assertFails(aliceMessageRef.update({ content: "Updated content by Alice" }));
    });

    it("Bob cannot update Alice's message content", async () => {
      const bob = testEnv.authenticatedContext("bob");
      const aliceMessageRef = bob.firestore().collection("messages").doc("aliceMessage");
      await assertFails(aliceMessageRef.update({ content: "Trying to update Alice's content" }));
    });
  });
});
