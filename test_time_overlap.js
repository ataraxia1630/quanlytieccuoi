// Test helper function for time overlap
const timeRangesOverlap = (start1, end1, start2, end2) => {
    // Convert time strings to minutes since midnight
    const timeToMinutes = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes + seconds / 60;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    // Simple approach: normalize all times to a continuous timeline
    // If a range is overnight (end < start), we extend it to next day
    
    const ranges1 = [];
    const ranges2 = [];
    
    // Create all possible interpretations of range 1
    if (e1 >= s1) {
        // Same day range
        ranges1.push({ start: s1, end: e1 });
    } else {
        // Overnight range: split into two parts
        ranges1.push({ start: s1, end: 24 * 60 }); // Evening part
        ranges1.push({ start: 0, end: e1 });       // Morning part
    }
    
    // Create all possible interpretations of range 2
    if (e2 >= s2) {
        // Same day range
        ranges2.push({ start: s2, end: e2 });
    } else {
        // Overnight range: split into two parts
        ranges2.push({ start: s2, end: 24 * 60 }); // Evening part
        ranges2.push({ start: 0, end: e2 });       // Morning part
    }
    
    // Check if any part of range1 overlaps with any part of range2
    for (const r1 of ranges1) {
        for (const r2 of ranges2) {
            // Two ranges overlap if: start1 < end2 AND start2 < end1
            if (r1.start < r2.end && r2.start < r1.end) {
                return true;
            }
        }
    }
    
    return false;
};

// Test cases
console.log("=== TIME OVERLAP TESTS ===");

console.log("\nTest 1 - Your original case:");
console.log("23:00:00 - 01:05:00 vs 02:00:00 - 03:00:00");
console.log("Expected: false (no overlap), Actual:", timeRangesOverlap("23:00:00", "01:05:00", "02:00:00", "03:00:00"));

console.log("\nTest 2 - Normal overlap:");
console.log("08:00:00 - 12:00:00 vs 10:00:00 - 14:00:00");
console.log("Expected: true (overlap), Actual:", timeRangesOverlap("08:00:00", "12:00:00", "10:00:00", "14:00:00"));

console.log("\nTest 3 - No overlap same day:");
console.log("08:00:00 - 12:00:00 vs 14:00:00 - 18:00:00");
console.log("Expected: false (no overlap), Actual:", timeRangesOverlap("08:00:00", "12:00:00", "14:00:00", "18:00:00"));

console.log("\nTest 4 - Overnight overlap (THIS WAS WRONG):");
console.log("23:00:00 - 01:00:00 vs 00:30:00 - 02:00:00");
console.log("Expected: true (overlap 00:30-01:00), Actual:", timeRangesOverlap("23:00:00", "01:00:00", "00:30:00", "02:00:00"));

console.log("\nTest 5 - Both overnight:");
console.log("22:00:00 - 02:00:00 vs 23:00:00 - 01:00:00");
console.log("Expected: true (overlap), Actual:", timeRangesOverlap("22:00:00", "02:00:00", "23:00:00", "01:00:00"));

console.log("\nTest 6 - Overnight vs early morning (no overlap):");
console.log("23:00:00 - 01:05:00 vs 01:30:00 - 03:00:00");
console.log("Expected: false (no overlap), Actual:", timeRangesOverlap("23:00:00", "01:05:00", "01:30:00", "03:00:00"));

console.log("\nTest 7 - Overnight vs early morning (overlap):");
console.log("23:00:00 - 02:00:00 vs 01:00:00 - 03:00:00");
console.log("Expected: true (overlap 01:00-02:00), Actual:", timeRangesOverlap("23:00:00", "02:00:00", "01:00:00", "03:00:00"));

console.log("\nTest 8 - Edge case - touching times:");
console.log("08:00:00 - 12:00:00 vs 12:00:00 - 16:00:00");
console.log("Expected: false (touching but not overlapping), Actual:", timeRangesOverlap("08:00:00", "12:00:00", "12:00:00", "16:00:00"));

console.log("\nTest 9 - Overnight touching:");
console.log("22:00:00 - 01:00:00 vs 01:00:00 - 03:00:00");
console.log("Expected: false (touching but not overlapping), Actual:", timeRangesOverlap("22:00:00", "01:00:00", "01:00:00", "03:00:00"));
