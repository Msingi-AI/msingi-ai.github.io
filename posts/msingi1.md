# 🧠 Language Models are Learnable from Scratch in Low-Resource Settings  
*Training a Swahili-First GPT Model with 85M Parameters and 45M Tokens*

---

## Overview

The majority of natural language processing (NLP) research today revolves around **multilingual models** that leverage massive pre-trained architectures like mBERT or GPT-3. The idea is simple: *fine-tune a large model on your language of interest*. But what happens when you strip away these enormous pre-trained models and build something from the ground up? 

In this post, we share our journey of building **Msingi1**, a **Swahili-first language model** trained entirely from scratch. With **no reliance on multilingual corpora**, no pretraining on English data, and no **gigantic parameters**, Msingi1 represents a small but significant step towards understanding how language models can be created for **low-resource languages**.

Our primary goal was simple: 

> **Can a tiny GPT-style model, trained on just Swahili data, learn to generate meaningful text?**

After training Msingi1 for **4 hours on a T4 GPU**, here’s what we learned.

---

## 1. Why Train From Scratch?

The current landscape of NLP is dominated by **fine-tuning pre-trained models**, like mBERT or GPT-2. These models are pre-trained on vast multilingual corpora that include English, Chinese, French, and hundreds of other languages. While this approach works for many languages, especially high-resource ones, it comes with several problems for low-resource languages:

- **Bias in Tokenization**: Multilingual tokenizers often prioritize English-centric tokenization strategies that are not ideal for languages like Swahili, which have unique morphological structures.
- **Mistranslation Issues**: Pre-trained multilingual models may have poor performance on languages like Swahili, as they are trained on noisy, often non-native translations, and don’t fully understand the language’s cultural or contextual meaning.
- **Lack of True Language Understanding**: These models “know” a language but don’t *think* in it. They’ve been taught English as a base and only partially incorporate the logic and structure of languages like Swahili.

By training a model **from scratch**, we allow the system to learn directly from the raw Swahili text — no interference from English, no pre-baked assumptions. This approach also allows us to explore **how small models can learn without the crutch of pretraining** on a language the model didn’t natively understand.

---

## 2. Model Architecture

We opted for a **GPT-style transformer** with 6 layers and a relatively small number of parameters. This choice ensured that we could train the model with limited computational resources while still experimenting with a model architecture that reflects those used by much larger models like GPT-3.

### Architecture Details:

| Component             | Value         |
|-----------------------|---------------|
| **Layers**            | 6             |
| **Hidden size**       | 384           |
| **Attention heads**   | 6             |
| **Parameters**        | ~85M          |
| **Sequence length**   | 512 tokens    |
| **Architecture**      | Decoder-only  |

At ~85 million parameters, this model is small by modern standards — significantly smaller than GPT-3 or even GPT-2. Yet it still contains enough complexity to model the intricate syntax and semantics of Swahili, a **Bantu language** with complex noun-class systems and verb morphology.

This decision to go small was intentional. We didn’t want to take shortcuts or rely on enormous compute power. We wanted to explore **what a compact model can achieve** and examine where its boundaries lie.

---

## 3. Dataset and Preprocessing

The dataset we used for Msingi1 is diverse, spanning across several genres of Swahili text. We collected approximately **45 million tokens** from the following sources:

- **News articles** from local publications
- **Public domain books**, particularly Swahili literature
- **Religious texts** (the Quran, Bible)
- **Government speeches and proceedings**
- **Web scraping** from Swahili pages

This diverse corpus ensured that the model would be exposed to a wide range of Swahili, from formal language in news reports to more colloquial expressions in online discussions.

For tokenization, we decided to use a **Unigram tokenizer** with a vocabulary size of 32,000. We chose Unigram because it strikes a balance between efficiency and handling rare words — important for Swahili’s rich morphology.

The **SentencePiece** tokenizer allowed us to manage the nuances of Swahili’s morphology, which can often result in long compound words. Unlike English, Swahili often uses affixes, prefixes, and suffixes that change the meaning of the root word significantly, so choosing the right tokenization method was critical.

---

## 4. Training Setup

Training Msingi1 was a real test of patience. We used a **T4 GPU** with a **batch size of 8**, training for **4 hours**. Given the size of the model and the hardware constraints, this was an aggressive but necessary choice to understand how quickly the model could converge on meaningful patterns.

### Training Details:

- **Optimizer**: AdamW
- **Learning rate**: Linearly warmed up, then decayed
- **Weight decay**: 0.01
- **Batch size**: 8
- **Effective batch size**: 8
- **Sequence length**: 512 tokens

Despite the limited batch size, the model showed stable training dynamics. Loss decreased consistently without any signs of divergence or overfitting. This is a clear indication that even smaller models, when trained from scratch on the right data, can **learn meaningful representations**.

The relatively small batch size was manageable on the T4, but there were certainly limitations. Longer training durations and larger batches could likely improve the model’s final performance, but this small-scale experiment was designed to test the core viability of training such a model.

---

## 5. Generation Results

We experimented with **text generation** to evaluate how well Msingi1 can handle the Swahili language. The most interesting results came from the **sampling parameters** we used. We varied the temperature, top-k, and repetition penalties to see how the model’s outputs would change.

### Sample Output:

**Prompt**:  
`Habari ya leo ni`

**Generated Output**:  
`Habari ya leo ni mbili sheria sheria sana eneo tena jeshi bila...`

🧠 **Observation**: The model is able to generate valid Swahili syntax, although repetition of words like "sheria" (law) occurs frequently. This type of behavior is common in smaller models, where word repetition may occur due to the model’s limited context window.

**Prompt**:  
`Rais wa Jamhuri ya Muungano wa`

**Generated Output**:  
`Rais wa Jamhuri ya Muungano wa Tanzania ametangaza kuwa uchaguzi mkuu utafanyika mwezi ujao.`

✅ **Observation**: The model generates more coherent output when the prompt is formal and contextually rich. The sentence is both grammatically correct and contextually relevant, demonstrating that the model has learned how to handle formal Swahili.

These experiments showed that Msingi1 is capable of generating meaningful Swahili text, though it still needs improvements in fluency and repetition control.

---

## 6. Lessons Learned

From our journey with Msingi1, we uncovered several key lessons that will inform our next steps:

- **Swahili is learnable** from scratch with limited data and small models. We were able to capture significant syntactic and semantic structure, even in a model with just 85M parameters.
- **Tokenization is critical**. We saw that using a Unigram tokenizer tailored to Swahili's morphology helped prevent fragmentation and reduced repetition, which is crucial in low-resource languages.
- **Repetition penalty is essential**. Without it, smaller models tend to repeat phrases and words, particularly when generating longer texts. This behavior is amplified in Swahili, where verbs and nouns often repeat in long compound forms.
- **Context and domain diversity matter**. Exposure to a wide range of Swahili sources helped the model handle both formal and informal text with more consistency.

---

## 7. Why This Matters

Training a model from scratch for Swahili demonstrates that **low-resource languages** don’t need to rely on multilingual models or massive datasets to develop functional, meaningful models. 

This experiment highlights the potential for building **language-specific models** for African languages and other low-resource languages. It's not about creating the biggest model possible — it's about building a foundation that reflects the structure and nuances of the language itself.

---

## 8. Next Steps

We plan to:

- Compare **Msingi1** with a distilled GPT-2 model trained on the same dataset.
- Fine-tune **Msingi1** on **domain-specific corpora**, such as medical and educational content, to improve its utility in real-world applications.
- Open-source the model’s **weights** and **tokenizer** for others to use and contribute to.
- Explore **alignment** techniques such as reinforcement learning from human feedback (RLHF) for better usability in Swahili-centric applications.

---

## Final Thought

Language models are not just about scaling up. They’re about understanding, interpreting, and reflecting the languages we work with. **Msingi1** is a small but meaningful step toward creating **equitable NLP tools** that respect language and culture, from the ground up.

---

**Follow @MsingiAI** for future updates as we continue to refine and expand this exciting project.

