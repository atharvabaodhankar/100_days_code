import { STRIVERS_A2Z_SHEET, StriverProblem } from "./strivers-sheet";
import { Problem, ProblemSource } from "@/types";

/**
 * Mapping of legacy TakeUForward slugs (from blogs, plus platform, or old sheets)
 * to official TUF Practice slugs on https://takeuforward.org/practice/dsa/<slug>
 */
export const KNOWN_TUF_SLUG_MAP: Record<string, string> = {
  // Day 33
  "count-subarray-sum-equals-k": "count-subarrays-with-given-sum",
  "program-to-generate-pascals-triangle": "pascals-triangle-i",

  // Day 37
  "merge-overlapping-subintervals": "merge-intervals",
  "merge-overlapping-intervals": "merge-intervals",

  // Binary Search on Answers (Days 50 - 59)
  "painters-partition-problem": "painters-partition",
  "aggressive-cows-detailed-solution": "aggressive-cows",
  "allocate-minimum-number-of-pages": "book-allocation-problem",
  "median-of-two-sorted-arrays-of-different-sizes": "median-of-2-sorted-arrays",
  "k-th-element-of-two-sorted-arrays": "kth-element-of-2-sorted-arrays",
  "minimise-maximum-distance-between-gas-stations": "minimise-max-distance-to-gas-stations",
  "minimize-max-distance-to-gas-station": "minimise-max-distance-to-gas-stations",
  "split-array-largest-sum": "split-array---largest-sum",

  // 2D Arrays (Days 60 - 64)
  "find-the-row-with-maximum-number-of-1s": "find-row-with-maximum-1's",
  "find-the-row-with-maximum-number-of-1-s": "find-row-with-maximum-1's",
  "search-in-a-row-and-column-wise-sorted-matrix": "search-in-2d-matrix-ii",
  "find-peak-element-ii": "find-peak-element-ii",

  // Strings (Days 65 - 79)
  "remove-outermost-parentheses": "remove-outermost-parentheses",
  "reverse-words-in-a-string": "reverse-every-word-in-a-string",
  "reverse-words-in-string": "reverse-every-word-in-a-string",
  "largest-odd-number-in-string": "largest-odd-number-in-a-string",
  "isomorphic-strings": "isomorphic-string",
  "check-whether-one-string-is-a-rotation-of-another": "rotate-string",
  "check-if-two-strings-are-anagrams-of-each-other": "valid-anagram",
  "sort-characters-by-frequency": "sort-characters-by-frequency",
  "maximum-nesting-depth-of-parentheses": "maximum-nesting-depth-of-the-parentheses",
  "string-to-integer-atoi": "string-to-integer-atoi",
  "count-number-of-substrings-with-k-distinct-characters": "count-number-of-substring",
  "longest-palindromic-substring": "longest-palindromic-substring",
  "sum-of-beauty-of-all-substrings": "sum-of-beauty-of-all-substrings",

  // Linked Lists (Days 80 - 92+)
  "introduction-to-linked-list": "traversal-in-linked-list",
  "insert-node-at-beginning-of-linked-list": "insertion-at-the-head-of-ll",
  "delete-last-node-of-linked-list": "deletion-of-the-tail-of-ll",
  "find-the-length-of-a-linked-list": "find-the-length-of-the-linked-list",
  "search-an-element-in-a-linked-list": "search-in-linked-list",
  "middle-of-a-linked-list": "find-middle-of-linked-list",
  "reverse-a-linked-list": "reverse-a-ll",
  "detect-a-loop-in-linked-list": "detect-a-loop-in-ll",
  "detect-a-cycle-in-a-linked-list": "detect-a-loop-in-ll",
  "find-starting-point-of-loop-in-linked-list": "find-the-starting-point-in-ll",
  "find-length-of-loop-in-linked-list": "length-of-loop-in-ll",
  "check-if-linked-list-is-palindrome": "check-if-ll-is-palindrome-or-not",
  "check-if-given-linked-list-is-palindrome": "check-if-ll-is-palindrome-or-not",
  "segregate-even-and-odd-nodes-in-linked-list": "segregate-odd-and-even-nodes-in-ll",
  "remove-nth-node-from-end-of-list": "remove-nth-node-from-the-back-of-the-ll",
  "delete-the-middle-node-of-the-linked-list": "delete-the-middle-node-in-ll",
  "delete-middle-node-of-ll": "delete-the-middle-node-in-ll",

  // Binary Search 1D
  "binary-search-to-find-x-in-sorted-array": "search-x-in-sorted-array",
  "binary-search-explained": "search-x-in-sorted-array",
  "implement-lower-bound": "lower-bound-",
  "implement-upper-bound": "upper-bound",
  "first-and-last-position-of-element-in-sorted-array": "first-and-last-occurrence",
  "count-occurrences-in-sorted-array": "count-occurrences-in-a-sorted-array",
  "search-in-rotated-sorted-array-ii": "search-in-rotated-sorted-array-2",
  "single-element-in-a-sorted-array": "single-element-in-sorted-array",
  "find-the-smallest-divisor-given-a-threshold": "find-the-smallest-divisor",

  // Recursion
  "power-set-print-all-subsequences": "power-set",
  "combination-sum-1": "combination-sum",
  "combination-sum-ii-find-all-unique-combinations": "combination-sum-ii",
  "combination-sum-ii": "combination-sum-ii",
  "combination-sum-iii": "combination-sum-iii",
  "subset-sum-sum-of-all-subsets": "subset-sum-1",
  "subset-ii-print-all-unique-subsets": "subset-sum-ii",
  "n-queens": "n-queen",
  "sudoku-solver": "sudoko-solver",

  // Bit Manipulation
  "check-if-a-number-is-power-of-2": "check-if-a-number-is-power-of-2-or-not",
  "single-number": "single-number---i",
  "find-the-number-that-appears-once-and-the-other-numbers-twice": "single-number---i",
  "minimum-bit-flips-to-convert-number": "minimum-bit-flips-to-convert-number",

  // Stacks & Queues
  "implement-stack-using-single-queue": "implement-stack-using-queue",
  "next-greater-element-using-stack": "next-greater-element",
  "next-greater-element-2": "next-greater-element-ii",
  "previous-smaller-element": "previous-smaller-element",
  "area-of-largest-rectangle-in-histogram": "largest-rectangle-in-histogram",

  // Sliding Window
  "length-of-longest-substring-without-any-repeating-characters": "longest-substring-without-repeating-characters",
  "count-number-of-nice-subarrays": "count-number-of-nice-subarrays",
  "longest-substring-with-at-most-k-distinct-characters": "longest-substring-with-at-most-k-distinct-characters",

  // Greedy
  "find-minimum-number-of-coins": "find-minimum-number-of-coins",
  "check-if-a-parentheses-string-can-be-valid": "valid-parenthesis-string",
  "fractional-knapsack-problem-greedy-approach": "fractional-knapsack",
  "n-meetings-in-one-room": "n-meetings-in-one-room",
  "minimum-number-of-platforms-required-for-a-railway": "minimum-number-of-platforms-required-for-a-railway",
  "job-sequencing-problem": "job-sequencing-problem",

  // Trees
  "preorder-inorder-postorder-traversals-in-one-traversal": "binary-tree-traversals",
  "calculate-the-diameter-of-a-binary-tree": "diameter-of-binary-tree",
  "check-for-symmetrical-binary-tree": "symmetric-binary-tree",
  "check-if-two-trees-are-identical-or-not": "check-if-two-trees-are-identical-or-not",
  "lowest-common-ancestor-for-two-given-nodes": "lowest-common-ancestor-for-two-given-nodes",
  "search-in-a-binary-search-tree-bst": "search-in-a-binary-search-tree",
  "ceil-in-a-binary-search-tree-bst": "ceil-in-a-binary-search-tree",
  "floor-in-a-binary-search-tree-bst": "floor-in-a-binary-search-tree",
  "insert-a-given-node-in-binary-search-tree-bst": "insert-a-given-node-in-binary-search-tree",
  "delete-a-node-in-binary-search-tree-bst": "delete-a-node-in-binary-search-tree",
  "kth-largest-smallest-element-in-binary-search-tree": "kth-largest-smallest-element-in-binary-search-tree",
  "check-if-a-binary-tree-is-bst-or-not": "check-if-a-binary-tree-is-bst-or-not",
  "lca-in-binary-search-tree-bst": "lca-in-binary-search-tree",

  // Graphs
  "detect-cycle-in-an-undirected-graph-using-bfs": "detect-cycle-in-an-undirected-graph",
  "rotton-oranges-min-time-to-rot-all-oranges-bfs": "rotting-oranges",
  "distance-of-nearest-cell-having-1": "01-matrix",
  "surrounded-regions-replace-os-with-xs": "surrounded-regions",
  "word-ladder-i-g-29": "word-ladder-i",
  "dijkstras-algorithm-using-priority-queue-g-32": "dijkstras-algorithm-using-priority-queue",
  "shortest-path-in-directed-acyclic-graph-topological-sort-g-27": "shortest-path-in-directed-acyclic-graph",
  "g-38-cheapest-flights-within-k-stops": "cheapest-flights-within-k-stops",
  "network-delay-time-dijkstras-algorithm-g-37": "network-delay-time",
  "bellman-ford-algorithm-g-41": "bellman-ford-algorithm",
  "floyd-warshall-algorithm-g-42": "floyd-warshall-algorithm",
  "disjoint-set-union-by-rank-union-by-size-path-compression-g-46": "disjoint-set-union-by-rank-and-size",
  "kruskals-algorithm-minimum-spanning-tree-g-47": "kruskals-algorithm-minimum-spanning-tree",

  // DP
  "dynamic-programming-climbing-stairs": "climbing-stairs",
  "dynamic-programming-frog-jump-dp-3": "frog-jump",
  "maximum-sum-of-non-adjacent-elements-dp-5": "maximum-sum-of-non-adjacent-elements",
  "dynamic-programming-house-robber-dp-6": "house-robber-ii",
  "dynamic-programming-ninjas-training-dp-7": "ninjas-training",
  "grid-unique-paths-dp-on-grids-dp8": "grid-unique-paths",
  "grid-unique-paths-2-dp-9": "grid-unique-paths-2",
  "minimum-path-sum-in-a-grid-dp-10": "minimum-path-sum-in-a-grid",
  "subset-sum-equal-to-target-dp-14": "subset-sum-equal-to-target",
  "partition-equal-subset-sum-dp-15": "partition-equal-subset-sum",
  "0-1-knapsack-dp-19": "0-1-knapsack",
  "minimum-coins-dp-20": "minimum-coins",
  "longest-common-subsequence-dp-25": "longest-common-subsequence",
  "edit-distance-dp-33": "edit-distance",
  "longest-increasing-subsequence-dp-41": "longest-increasing-subsequence",
  "longest-divisible-subset-dp-44": "longest-divisible-subset",
};

/**
 * Resolves any TakeUForward URL (legacy blog, plus, or outdated practice slug)
 * to the official working practice URL on https://takeuforward.org/practice/dsa/<slug>
 */
export function resolveCanonicalTufUrl(url?: string, title?: string): string {
  if (!url || typeof url !== "string" || !url.includes("takeuforward.org")) {
    return url || "";
  }

  // 1. Extract slug from URL
  let slug = "";
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    slug = parts[parts.length - 1] || "";
  } catch {
    slug = url.split("/").filter(Boolean).pop() || "";
  }
  slug = slug.split("?")[0].toLowerCase().trim();

  // 2. Check if slug matches directly in official sheet
  const exactProblem = STRIVERS_A2Z_SHEET.find(
    (p) => p.slug.toLowerCase() === slug
  );
  if (exactProblem) {
    return `https://takeuforward.org/practice/dsa/${exactProblem.slug}`;
  }

  // 3. Check known alias mapping
  if (KNOWN_TUF_SLUG_MAP[slug]) {
    const targetSlug = KNOWN_TUF_SLUG_MAP[slug];
    return `https://takeuforward.org/practice/dsa/${targetSlug}`;
  }

  // 4. Try matching by problem title if provided
  if (title) {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const titleMatch = STRIVERS_A2Z_SHEET.find((p) => {
      const pTitle = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return pTitle === cleanTitle || (cleanTitle.length > 6 && pTitle.includes(cleanTitle));
    });

    if (titleMatch) {
      return `https://takeuforward.org/practice/dsa/${titleMatch.slug}`;
    }
  }

  // 5. Fallback: normalize to canonical practice URL format
  return `https://takeuforward.org/practice/dsa/${slug}`;
}

/**
 * Normalizes all problems within a day or draft.
 * Returns the updated problems and a log of any changed URLs.
 */
export function normalizeProblemTufUrls(problems: Problem[]): {
  problems: Problem[];
  hasChanges: boolean;
  changes: { title: string; oldUrl: string; newUrl: string }[];
} {
  let hasChanges = false;
  const changes: { title: string; oldUrl: string; newUrl: string }[] = [];

  const updatedProblems: Problem[] = problems.map((problem): Problem => {
    if (problem.sourceUrl && problem.sourceUrl.includes("takeuforward.org")) {
      const resolved = resolveCanonicalTufUrl(problem.sourceUrl, problem.title);
      if (resolved !== problem.sourceUrl) {
        hasChanges = true;
        changes.push({
          title: problem.title,
          oldUrl: problem.sourceUrl,
          newUrl: resolved,
        });
        return {
          ...problem,
          sourceUrl: resolved,
          sourceName: "takeuforward" as ProblemSource,
        };
      }
    }
    return problem;
  });

  return {
    problems: updatedProblems,
    hasChanges,
    changes,
  };
}
