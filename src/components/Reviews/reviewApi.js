/*
 * Local prototype data layer. These exports preserve the original review flow.
 * For production, move verification, submission, approval, and public/private
 * data separation to a trusted backend; browser storage is not secure auth.
 */
import { TOPICS } from "./reviewConstants";

const memoryStore = Object.create(null);

const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return Object.prototype.hasOwnProperty.call(memoryStore, key)
        ? memoryStore[key]
        : fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      memoryStore[key] = value;
    }
  },
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const clean = (value) => String(value || "").replace(/<[^>]*>/g, "").trim();

export const getUser = () => store.get("uu_user", null);
export const saveUser = (user) => store.set("uu_user", user);

export async function listPublic() {
  await wait(500);
  return store.get("uu_pub", []).filter(
    (review) => review.moderationStatus === "approved"
  );
}

export async function submitReview(payload, user) {
  await wait(700);

  if (!user || user.status !== "verified") {
    throw new Error("Your college is not verified.");
  }

  const title = clean(payload.title);
  const experience = clean(payload.experience);
  const errors = [];

  if (!(payload.ratings?.overall >= 1 && payload.ratings.overall <= 5)) {
    errors.push("Overall rating required.");
  }
  if (title.length < 5 || title.length > 120) {
    errors.push("Title must be 5–120 characters.");
  }
  if (experience.length < 50 || experience.length > 3000) {
    errors.push("Experience must be 50–3000 characters.");
  }
  if (!TOPICS.includes(payload.topic)) errors.push("Choose a topic.");
  if (!payload.confirm) errors.push("Authenticity confirmation required.");
  if (errors.length) throw new Error(errors.join(" "));

  const id = `r${Date.now()}`;
  const publishedReview = {
    reviewId: id,
    collegeId: user.collegeId,
    collegeName: user.college,
    title,
    topic: payload.topic,
    overallRating: payload.ratings.overall,
    categoryRatings: Object.fromEntries(
      Object.entries(payload.ratings).filter(
        ([key, value]) => key !== "overall" && value > 0
      )
    ),
    liked: clean(payload.liked),
    improvements: clean(payload.improvements),
    experience,
    hostel: clean(payload.hostel),
    food: clean(payload.food),
    facilities: clean(payload.facilities),
    course: clean(payload.course),
    department: clean(payload.department),
    studyYear: clean(payload.year),
    isAnonymous: Boolean(payload.anonymous),
    authorName: payload.anonymous ? "Anonymous Student" : user.name,
    moderationStatus: "pending",
    createdAt: Date.now(),
  };

  store.set("uu_pub", [publishedReview, ...store.get("uu_pub", [])]);
  store.set("uu_priv", {
    ...store.get("uu_priv", {}),
    [id]: user.uid,
  });

  return publishedReview;
}

export function approvePending() {
  store.set(
    "uu_pub",
    store.get("uu_pub", []).map((review) =>
      review.moderationStatus === "pending"
        ? { ...review, moderationStatus: "approved" }
        : review
    )
  );
}
