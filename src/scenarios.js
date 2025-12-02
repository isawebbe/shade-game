// scenarios.js
// Utility to generate random shade (0-255)
export const randomShade = () => Math.floor(Math.random() * 256);

// Shuffle helper for options
export const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

// Scenario template with variant support
export const scenarios = [
  {
    id: 1,
    variants: {
      X: {
        title: `Your name is Stanislav.`,
        body: `You live in a vast old country whose greatness is perhaps behind her. Yes, there are those as you who polished the right elbows and found themselves an esteemed position as a high-ranking military official.`,
        options: {
          A: `In spite of its shortcomings, here is a fine place to live`,
          C: `You could watch it all burn`
        },
        followUp: {
          A: `After all, all your friends and family are here. You dream of traveling someday.`,
          C: `You have long fallen out of love with the motherland. Memories of your birth village fail to elicit tenderness.`
        }
      }
    }
  },
  {
    id: 2,
    variants: {
      X: {
        title: `You are forty-four years old.`,
        body: `It was your birthday recently. Your wife Julia forgot and made last-minute festivities.`,
        options: {
          A: `She did her best`,
          B: `She has been married to you ten years already!`,
          C: `She should not have bothered`
        },
        followUp: {
          A: `Good friends attended and an appropriate amount of vodka was libated.`,
          B: `And every year she forgets!`,
          C: `The party caused you only depression.`
        }
      }
    }
  }
  // Add more scenarios up to 37...
];
