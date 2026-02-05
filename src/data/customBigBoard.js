// Matt's Custom Big Board Rankings
// Format: Array of player IDs in your preferred order
// The ID corresponds to the player's consensus rank (their id in prospects.js)
//
// Example: If you think player #5 (consensus) should be #1, put 5 first
// [5, 1, 3, 2, 4, ...] means:
//   Your #1 = Consensus #5
//   Your #2 = Consensus #1
//   Your #3 = Consensus #3
//   etc.
//
// Players not listed will appear after your ranked players in consensus order

export const customBigBoardRankings = [
  // Add player IDs here in your preferred order
  // Example:
  // 1,   // Fernando Mendoza, QB, Indiana
  // 2,   // Caleb Downs, S, Ohio State
  // 3,   // Rueben Bain Jr., EDGE, Miami (FL)
  // ...
];

// Your board name (displayed in the UI)
export const customBoardName = "Mr Lutz's Board";

// Optional: Add notes for specific players
// Format: { playerId: "Your note about this player" }
export const customPlayerNotes = {
  // Example:
  // 1: "Best QB in the class, elite arm talent",
  // 5: "Could be the best DL prospect in years",
};
