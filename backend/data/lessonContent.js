const lessonContent = {
  1: {
    title: "Lesson 1: Basic Greetings",
    parts: [
      {
        id: 1,
        title: "New Vocabulary",
        type: "vocabulary",
        content: `
Welcome to Lesson 1! Let's start with basic Hebrew greetings.

**New Vocabulary Words:**
Today we'll learn essential greeting words using flashcards.

<div class="flashcard-container">
  <img src="/api/lesson/1/flashcard" alt="Lesson 1 Flashcard" class="lesson-flashcard" />
</div>

Study the words on the flashcard above. These are your foundation words for Hebrew greetings.

**Practice:** 
- Look at each word on the flashcard
- Try to pronounce each word
- Pay attention to the Hebrew script
        `,
        completed: false
      },
      {
        id: 2,
        title: "Sentence Pattern",
        type: "sentence_pattern",
        content: `
Now let's build sentences using the vocabulary from this lesson.

**Sentence Pattern: Basic Greetings**

Using the words from our flashcard, we can create simple greeting sentences:

**Pattern:** [Greeting] + [Name/Person]

Examples:
- שלום + [name] (Shalom + name)
- בוקר טוב (Boker tov - Good morning)

**Your Turn:**
Try building sentences using the vocabulary words from the flashcard above. 

🔊 **Audio Practice:** Listen to pronunciation examples (audio coming soon).

**Exercise:** Create 3 different greeting sentences using the vocabulary.
        `,
        completed: false
      },
      {
        id: 3,
        title: "Free Speech",
        type: "free_speech",
        content: `
Time to practice speaking! Use the vocabulary and sentence patterns you've learned.

**Speaking Practice:**

Create and say aloud sentences using:
- The vocabulary from Part 1
- The sentence patterns from Part 2

**Speaking Prompts:**
1. Greet someone in the morning
2. Say hello to a friend
3. Use a formal greeting

🎤 **Voice Practice:** 
Soon you'll be able to practice with our AI voice agent using OpenAI's real-time API.

**Challenge:** Record yourself saying 5 different greetings in Hebrew.
        `,
        completed: false
      },
      {
        id: 4,
        title: "Hebrew Letters & Vowels",
        type: "letters_vowels",
        content: `
Let's learn the Hebrew letters and vowels from today's vocabulary.

**Letters in Today's Vocabulary:**

From the words on our flashcard, we'll focus on these key letters:
- ש (Shin)
- ל (Lamed) 
- ו (Vav)
- ם (Final Mem)

**Letter Practice:**
1. **Recognition:** Identify these letters in the vocabulary words
2. **Pronunciation:** Learn how each letter sounds
3. **Writing:** Practice writing each letter

**Vowel Sounds:**
- Learn the vowel marks (nikud) used with these letters
- Practice pronouncing letters with different vowel sounds

**Unknown Word Practice:**
When you see these letters in new words, you'll know how to pronounce them!
        `,
        completed: false
      }
    ]
  },
  2: {
    title: "Lesson 2: Family Members",
    parts: [
      {
        id: 1,
        title: "New Vocabulary",
        type: "vocabulary",
        content: `
Welcome to Lesson 2! Today we'll learn about family members in Hebrew.

**New Vocabulary Words:**
Learn family member terms using today's flashcard.

<div class="flashcard-container">
  <img src="/api/lesson/2/flashcard" alt="Lesson 2 Flashcard" class="lesson-flashcard" />
</div>

**Review Previous Lesson:**
Don't forget the greeting words from Lesson 1 - we'll use them together!

**Practice:** 
- Study the family terms on the flashcard
- Connect these words with the greetings from Lesson 1
- Notice new Hebrew letters and sounds
        `,
        completed: false
      },
      {
        id: 2,
        title: "Sentence Pattern",
        type: "sentence_pattern",
        content: `
Build sentences combining family vocabulary with greetings.

**Sentence Pattern: Greetings + Family**

Combine vocabulary from Lessons 1 & 2:

**Pattern:** [Greeting] + [Family Member]

Examples:
- שלום אמא (Shalom ima - Hello mother)
- בוקר טוב אבא (Boker tov aba - Good morning father)

**Your Turn:**
Create sentences using:
- Greetings from Lesson 1
- Family words from Lesson 2

🔊 **Audio Practice:** Practice pronunciation with both lesson vocabularies.

**Exercise:** Make 5 sentences greeting different family members.
        `,
        completed: false
      },
      {
        id: 3,
        title: "Free Speech",
        type: "free_speech",
        content: `
Speaking practice with expanded vocabulary!

**Speaking Practice:**

Create conversations using vocabulary from Lessons 1 & 2:
- Greetings (Lesson 1)
- Family members (Lesson 2)

**Speaking Scenarios:**
1. Greet your family in the morning
2. Introduce family members to someone
3. Have a conversation about your family

🎤 **Voice Practice:** 
Practice with our AI voice agent (coming soon with OpenAI real-time API).

**Challenge:** Create a short conversation introducing 3 family members.
        `,
        completed: false
      },
      {
        id: 4,
        title: "Hebrew Letters & Vowels",
        type: "letters_vowels",
        content: `
New letters from family vocabulary + review from Lesson 1.

**New Letters in Lesson 2:**
From today's family vocabulary:
- א (Aleph)
- מ (Mem)
- ב (Bet)
- ת (Tav)

**Review Letters from Lesson 1:**
- ש (Shin) - still used!
- ל (Lamed) - appears in family words too
- ו (Vav)
- ם (Final Mem)

**Letter Combinations:**
See how letters from both lessons combine in words.

**Growing Vocabulary:**
You can now recognize and pronounce letters from 2 lessons worth of vocabulary!
        `,
        completed: false
      }
    ]
  }
};

// Generate placeholder content for lessons 3-18
for (let i = 3; i <= 18; i++) {
  lessonContent[i] = {
    title: `Lesson ${i}: Coming Soon`,
    parts: [
      {
        id: 1,
        title: "New Vocabulary",
        type: "vocabulary",
        content: `
Lesson ${i} vocabulary content will be available soon.

<div class="flashcard-container">
  <img src="/api/lesson/${i}/flashcard" alt="Lesson ${i} Flashcard" class="lesson-flashcard" />
</div>

This lesson will build upon vocabulary from Lessons 1-${i-1}.
        `,
        completed: false
      },
      {
        id: 2,
        title: "Sentence Pattern",
        type: "sentence_pattern",
        content: `
Lesson ${i} sentence patterns will combine vocabulary from all previous lessons.

Content coming soon...
        `,
        completed: false
      },
      {
        id: 3,
        title: "Free Speech",
        type: "free_speech",
        content: `
Speaking practice for Lesson ${i} coming soon.

🎤 Voice practice with AI agent.
        `,
        completed: false
      },
      {
        id: 4,
        title: "Hebrew Letters & Vowels",
        type: "letters_vowels",
        content: `
Letter and vowel learning for Lesson ${i} coming soon.

Building on letters from Lessons 1-${i-1}.
        `,
        completed: false
      }
    ]
  };
}

module.exports = lessonContent;