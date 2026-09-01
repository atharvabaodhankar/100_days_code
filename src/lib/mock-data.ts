import { AdminDay, PublicDay } from "@/types";

export const MOCK_DAYS: AdminDay[] = [
  {
    id: "day-25",
    dayNumber: 25,
    topic: "Arrays & Two Pointers",
    status: "published",
    problemCount: 2,
    rawUrls: [
      "https://takeuforward.org/plus/dsa/problems/second-largest-element",
      "https://leetcode.com/problems/two-sum/",
    ],
    whatsappMessage: `🚀 *Day 25 — 100 Days of Code*
📚 *Topic: Arrays & Two Pointers*

Hey folks! Today we are sharpening our fundamental array manipulation techniques. We focus on single-pass scanning and the classic hash map index lookup.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Today's Challenges:*

1️⃣ *Second Largest Element* (Easy)
🔗 https://takeuforward.org/plus/dsa/problems/second-largest-element

2️⃣ *Two Sum* (Easy)
🔗 https://leetcode.com/problems/two-sum/
━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Detailed explanations, dry runs & reference code:*
👉 https://challenge.atharvabaodhankar.me/day/25

_Give it a solid 30 minutes of independent thought before checking the breakdown!_ 💻🔥`,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:15:00Z",
    publishedAt: "2026-09-01T08:30:00Z",
    generationMetadata: {
      providerUsed: "gemini",
      tokensUsed: 1420,
      latencyMs: 1850,
    },
    problems: [
      {
        id: "p-25-1",
        order: 1,
        title: "Second Largest Element",
        topic: "Arrays",
        difficulty: "Easy",
        sourceName: "takeuforward",
        sourceUrl: "https://takeuforward.org/plus/dsa/problems/second-largest-element",
        statement: "Given an array of integers `nums`, return the second largest distinct element in the array. If no such element exists, return -1.",
        constraints: [
          "2 <= nums.length <= 10^5",
          "1 <= nums[i] <= 10^9",
        ],
        examples: [
          {
            input: "nums = [12, 35, 1, 10, 34, 1]",
            output: "34",
            explanation: "The largest element of the array is 35 and the second largest element is 34.",
          },
          {
            input: "nums = [10, 10, 10]",
            output: "-1",
            explanation: "The largest element is 10 and there is no distinct second largest element.",
          },
        ],
        shortDescription: "Find the 2nd distinct maximum value in an array in a single traversal.",
        observation: "Sorting the array takes O(N log N) time, but we only need the top two distinct values. We can maintain two tracking variables in a single pass of O(N).",
        logic: "Maintain two variables: `largest` and `secondLargest`, initialized to -1.\n1. Traverse through each element in the array.\n2. If the current element is greater than `largest`, update `secondLargest = largest` and `largest = element`.\n3. Else if the current element is strictly less than `largest` but greater than `secondLargest`, update `secondLargest = element`.\n4. Return `secondLargest`.",
        approach: "Step 1: Initialize `largest = -1` and `secondLargest = -1`.\nStep 2: Iterate through every element `x` in `nums`.\nStep 3: Update `largest` and `secondLargest` conditionally.\nStep 4: After loop completion, `secondLargest` holds the answer.",
        dryRun: `Input: [12, 35, 1, 10, 34, 1]
- Init: largest = -1, secondLargest = -1
- x = 12: 12 > -1 -> secondLargest = -1, largest = 12
- x = 35: 35 > 12 -> secondLargest = 12, largest = 35
- x = 1:  1 < 35 and 1 < 12 -> no change
- x = 10: 10 < 35 and 10 < 12 -> no change
- x = 34: 34 < 35 and 34 > 12 -> secondLargest = 34
- x = 1:  no change
Result: 34`,
        complexity: {
          time: "O(N) — Single pass traversal through array elements.",
          space: "O(1) — Only constant auxiliary space for pointers.",
        },
        keyConcepts: ["Array Traversal", "Single Pass Greedy", "State Variables"],
        solutions: {
          cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int getSecondLargest(vector<int>& nums) {
        int largest = -1;
        int secondLargest = -1;

        for (int num : nums) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num < largest && num > secondLargest) {
                secondLargest = num;
            }
        }
        return secondLargest;
    }
};`,
          python: `class Solution:
    def getSecondLargest(self, nums: list[int]) -> int:
        largest = -1
        second_largest = -1
        
        for num in nums:
            if num > largest:
                second_largest = largest
                largest = num
            elif largest > num > second_largest:
                second_largest = num
                
        return second_largest`,
          java: `class Solution {
    public int getSecondLargest(int[] nums) {
        int largest = -1;
        int secondLargest = -1;

        for (int num : nums) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num < largest && num > secondLargest) {
                secondLargest = num;
            }
        }
        return secondLargest;
    }
}`,
        },
      },
      {
        id: "p-25-2",
        order: 2,
        title: "Two Sum",
        topic: "Arrays & Hash Maps",
        difficulty: "Easy",
        sourceName: "leetcode",
        sourceUrl: "https://leetcode.com/problems/two-sum/",
        statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
        ],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
          },
        ],
        shortDescription: "Find the two indices whose values sum up to the given target.",
        observation: "For each element `x`, we need to check if `target - x` has already been seen in the array. Storing seen elements in a hash map gives O(1) average lookup.",
        logic: "1. Create a hash map storing `{value: index}`.\n2. Iterate through `nums` with index `i`.\n3. Compute complement: `complement = target - nums[i]`.\n4. If `complement` exists in hash map, return `[map[complement], i]`.\n5. Otherwise, insert `nums[i]: i` into the map.",
        approach: "Step 1: Initialize empty hash map `seen`.\nStep 2: Loop `i` from 0 to `nums.length - 1`.\nStep 3: Check `target - nums[i]` in `seen`.\nStep 4: Return pair of indices immediately upon first match.",
        dryRun: `Input: nums = [2, 7, 11, 15], target = 9
- Init: seen = {}
- i = 0, num = 2: complement = 9 - 2 = 7. Not in seen -> seen[2] = 0
- i = 1, num = 7: complement = 9 - 7 = 2. Found in seen with index 0!
- Match: return [0, 1]`,
        complexity: {
          time: "O(N) — Single pass iteration over array with O(1) map lookups.",
          space: "O(N) — Storing up to N elements in the hash map.",
        },
        keyConcepts: ["Hash Map", "Complement Lookup", "Array Indexing"],
        solutions: {
          cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
          python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
          java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
        },
      },
    ],
  },
  {
    id: "day-24",
    dayNumber: 24,
    topic: "Sliding Window & Subarrays",
    status: "published",
    problemCount: 2,
    rawUrls: [
      "https://leetcode.com/problems/max-consecutive-ones/",
      "https://takeuforward.org/plus/dsa/problems/longest-subarray-with-sum-k",
    ],
    whatsappMessage: `🚀 *Day 24 — 100 Days of Code*
📚 *Topic: Sliding Window & Subarrays*

Daily challenge is live! Focus on expanding/contracting windows dynamically.

1️⃣ Max Consecutive Ones (Easy)
2️⃣ Longest Subarray with Sum K (Medium)

👉 https://challenge.atharvabaodhankar.me/day/24`,
    createdAt: "2026-08-31T08:00:00Z",
    updatedAt: "2026-08-31T08:15:00Z",
    publishedAt: "2026-08-31T08:30:00Z",
    problems: [
      {
        id: "p-24-1",
        order: 1,
        title: "Max Consecutive Ones",
        topic: "Arrays",
        difficulty: "Easy",
        sourceName: "leetcode",
        sourceUrl: "https://leetcode.com/problems/max-consecutive-ones/",
        statement: "Given a binary array `nums`, return the maximum number of consecutive 1's in the array.",
        constraints: ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1."],
        examples: [
          {
            input: "nums = [1,1,0,1,1,1]",
            output: "3",
            explanation: "The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.",
          },
        ],
        shortDescription: "Count the longest run of consecutive 1s in a binary array.",
        observation: "We can maintain a current streak counter that resets on 0 and updates the global maximum.",
        logic: "Initialize `maxCount = 0` and `currentStreak = 0`. Iterate through `nums`. If `num == 1`, increment `currentStreak` and update `maxCount = max(maxCount, currentStreak)`. If `num == 0`, reset `currentStreak = 0`.",
        approach: "Step 1: Loop through each element.\nStep 2: Update counter on 1, reset on 0.\nStep 3: Return maxCount.",
        dryRun: "nums = [1, 1, 0, 1, 1, 1]\n- 1 -> streak=1, max=1\n- 1 -> streak=2, max=2\n- 0 -> streak=0, max=2\n- 1 -> streak=1, max=2\n- 1 -> streak=2, max=2\n- 1 -> streak=3, max=3\nResult: 3",
        complexity: {
          time: "O(N) — Linear scan through the array.",
          space: "O(1) — Constant memory.",
        },
        keyConcepts: ["Streak Tracking", "Single Pass"],
        solutions: {
          cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int maxCount = 0;
        int current = 0;
        for (int x : nums) {
            if (x == 1) {
                current++;
                maxCount = max(maxCount, current);
            } else {
                current = 0;
            }
        }
        return maxCount;
    }
};`,
          python: `class Solution:
    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:
        max_count = 0
        current = 0
        for x in nums:
            if x == 1:
                current += 1
                max_count = max(max_count, current)
            else:
                current = 0
        return max_count`,
        },
      },
      {
        id: "p-24-2",
        order: 2,
        title: "Longest Subarray with Sum K",
        topic: "Prefix Sum & Hash Map",
        difficulty: "Medium",
        sourceName: "takeuforward",
        sourceUrl: "https://takeuforward.org/plus/dsa/problems/longest-subarray-with-sum-k",
        statement: "Given an array `nums` and an integer `k`, find the length of the longest subarray that sums to `k`.",
        constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        examples: [
          {
            input: "nums = [10, 5, 2, 7, 1, 9], k = 15",
            output: "4",
            explanation: "The subarray [5, 2, 7, 1] has a sum of 15 and length 4.",
          },
        ],
        shortDescription: "Determine the maximum length of a subarray whose elements add up to k.",
        observation: "If prefixSum[j] - prefixSum[i] = k, then the subarray between i and j has sum k. Storing the earliest occurrence of each prefix sum allows us to maximize the window length.",
        logic: "Use a prefix sum hash map storing `{prefixSum: earliestIndex}`.",
        approach: "Step 1: Iterate through array maintaining running sum.\nStep 2: Check if sum equals k or (sum - k) exists in map.\nStep 3: Update max length.",
        dryRun: "Running sum tracking with earliest index preservation.",
        complexity: {
          time: "O(N) — Single pass with hash table lookups.",
          space: "O(N) — Prefix sum hash table.",
        },
        keyConcepts: ["Prefix Sum", "Hash Map"],
        solutions: {
          cpp: `// C++ implementation using unordered_map`,
          python: `# Python implementation using dict`,
        },
      },
    ],
  },
  {
    id: "day-26",
    dayNumber: 26,
    topic: "Recursion & Backtracking Intro",
    status: "draft",
    problemCount: 2,
    rawUrls: [
      "https://takeuforward.org/plus/dsa/problems/print-subsequences",
      "https://leetcode.com/problems/subsets/",
    ],
    whatsappMessage: `🚀 *Day 26 (Draft) — 100 Days of Code*
📚 *Topic: Recursion & Backtracking*

Exploring pick / don't pick recursive branching patterns today!`,
    createdAt: "2026-09-01T12:00:00Z",
    updatedAt: "2026-09-01T12:30:00Z",
    generationMetadata: {
      providerUsed: "groq",
      tokensUsed: 1680,
      latencyMs: 1420,
    },
    problems: [
      {
        id: "p-26-1",
        order: 1,
        title: "Subsets (Power Set)",
        topic: "Recursion",
        difficulty: "Medium",
        sourceName: "leetcode",
        sourceUrl: "https://leetcode.com/problems/subsets/",
        statement: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
        constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10"],
        examples: [
          {
            input: "nums = [1,2,3]",
            output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
          },
        ],
        shortDescription: "Generate all 2^N subsets of a given set of unique numbers.",
        observation: "At every index, we make a binary choice: either include `nums[index]` in the current subset, or exclude it.",
        logic: "Recursive tree with 2 branches at each depth.",
        approach: "Step 1: Base case when index == nums.length, record subset.\nStep 2: Include element & recurse.\nStep 3: Exclude element & recurse.",
        dryRun: "Recursion tree depth 3 for [1, 2, 3].",
        complexity: {
          time: "O(2^N * N) — 2^N subsets each taking O(N) to clone.",
          space: "O(N) — Recursive stack depth.",
        },
        keyConcepts: ["Backtracking", "Pick / Don't Pick", "Recursion Tree"],
        solutions: {
          cpp: `#include <vector>
using namespace std;

class Solution {
    void backtrack(int index, vector<int>& nums, vector<int>& current, vector<vector<int>>& result) {
        if (index == nums.size()) {
            result.push_back(current);
            return;
        }
        // Pick
        current.push_back(nums[index]);
        backtrack(index + 1, nums, current, result);
        current.pop_back();

        // Don't Pick
        backtrack(index + 1, nums, current, result);
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(0, nums, current, result);
        return result;
    }
};`,
          python: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []
        
        def backtrack(index: int, current: list[int]):
            if index == len(nums):
                result.append(list(current))
                return
            # Pick
            current.append(nums[index])
            backtrack(index + 1, current)
            current.pop()
            
            # Don't pick
            backtrack(index + 1, current)
            
        backtrack(0, [])
        return result`,
        },
      },
    ],
  },
];

export function getPublicDays(): PublicDay[] {
  return MOCK_DAYS.filter((d) => d.status === "published").map((d) => ({
    id: d.id,
    dayNumber: d.dayNumber,
    topic: d.topic,
    status: "published",
    problemCount: d.problems.length,
    publishedAt: d.publishedAt || d.createdAt,
    problems: d.problems,
  }));
}

export function getPublicDayByNumber(dayNumber: number): PublicDay | undefined {
  const day = MOCK_DAYS.find((d) => d.dayNumber === dayNumber && d.status === "published");
  if (!day) return undefined;
  return {
    id: day.id,
    dayNumber: day.dayNumber,
    topic: day.topic,
    status: "published",
    problemCount: day.problems.length,
    publishedAt: day.publishedAt || day.createdAt,
    problems: day.problems,
  };
}

export function getAllAdminDays(): AdminDay[] {
  return MOCK_DAYS;
}

export function getAdminDayByNumber(dayNumber: number): AdminDay | undefined {
  return MOCK_DAYS.find((d) => d.dayNumber === dayNumber);
}
