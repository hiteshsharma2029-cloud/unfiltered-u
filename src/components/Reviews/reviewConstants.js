export const TOPICS = [
  "Overall College Experience",
  "Teaching & Faculty",
  "Placements & Career Support",
  "Campus Infrastructure",
  "Hostel Experience",
  "Food & Mess",
  "Clubs & Student Life",
  "Fees & Value for Money",
  "Course or Department Experience",
  "Other",
];

export const CATS = [
  ["overall", "Overall college experience"],
  ["teaching", "Teaching and faculty"],
  ["infra", "Campus infrastructure"],
  ["placements", "Placements and career support"],
  ["clubs", "Clubs, activities, and student life"],
  ["value", "Value for money"],
];

export const FLOW = [
  ["Share your experience", "You decide what students should know about your college."],
  ["Verify your college", "Confirm your college association before submitting a review."],
  ["Write your review", "Share your genuine experience, ratings, and useful insights."],
  ["Choose your identity", "Publish using your name or choose the anonymous option."],
  ["Review & submit", "Check your review before submitting it for publication."],
  ["Help students decide", "Your honest experience can help other students make informed decisions."],
];

export const BLANK = {
  ratings: { overall: 0 },
  topic: "",
  title: "",
  liked: "",
  improvements: "",
  experience: "",
  course: "",
  department: "",
  year: "",
  hostel: "",
  food: "",
  facilities: "",
  confirm: false,
};

export const go = (id) => {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
};
