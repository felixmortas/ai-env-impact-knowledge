You often hear that a ChatGPT query consumes six times more electricity than a Google search, and that it takes about half a liter of water to generate 10 to 50 answers [@enault2025impactIA].

But do these figures really reflect reality?

**Not so fast!** Behind these claims lie approximations and methodological shortcuts that deserve a closer look.

The [calculator designed to illustrate this article](https://felixmortas.com/ai-inf-calculator) estimates that this simple message sent to DeepSeek emitted 0.28 g of CO₂ equivalent (gCO₂e) and consumed 0.06 mL of water. That's the equivalent of a light bulb left on for 6 minutes, and 1 drop of water.

![Simple conversation with DeepSeek](images/small-prompt.png){width=60%}

Yet [the calculator](https://felixmortas.com/ai-inf-calculator) estimates that this far more complex exchange with Claude emitted 7.48 gCO₂e and consumed 2 mL of water. That's the equivalent of a light bulb left on for 3 hours and 53 minutes, and 40 drops of water.

![More complex conversation with Claude](images/big-prompt.png){width=60%}

*The estimates take into account the chatbot's visible text, the electricity used to run the AI, and the water used to cool the data center. They do not take into account the AI's reasoning, action loops, model training, the manufacturing of the computer hardware and the data center, network usage, or the water consumed to produce the electricity. The overall environmental impact is therefore largely underestimated.*

**So how do we explain such a difference?**

In this article, we will decode what lies behind these figures and understand what really causes the environmental footprint of our conversations with AI to vary. You will also realize that adopting good environmental practices generally leads to more efficient use.

# Introduction

In a context of climate change driven by human activities [@IPCC2021SPM], even the Pope is worried about the risks posed by AI [@leoXIV2026MagnificaHumanitas].

The IEA's "Energy and AI" report published in April 2025 forecasts that global energy demand from data centers will double to about 945 TWh by 2030 — a level comparable to Japan's annual electricity consumption — and is expected to reach about 1,200 TWh by 2035 [@iea2025energy].
The United Nations recently published a report on the environmental impact of AI in terms of carbon emissions and water consumption [@aczel2026environmental].

Organizations as well as individuals need to keep their environmental footprint in check. Concrete, real-world advice for reducing this impact is needed for both users and developers. But to act effectively, you first need to understand certain aspects of how AI works. 

I carried out research on the environmental impact of generative AI for 18 months at AXA, which allowed me to build up a great deal of knowledge on the subject that I now want to share with you.

Through this article, [you will understand](#understand) which factors most influence the environmental impact of AI, how to [measure it](#measure) when possible, and how to [reduce it](#reduce) as an end user and as a developer. 

You will also discover [this calculator](https://felixmortas.com/ai-inf-calculator/), which lets you measure the impact of one of your conversations with a chatbot (ChatGPT, Claude, Gemini, but also Mistral, DeepSeek, etc.). You will also be able to simulate applying certain good practices to that same conversation, and thus see how relevant they are.

*This calculator **is not intended** to compete with existing estimation methods, nor to provide a definitive measurement. Its purpose is to illustrate the effectiveness of the good practices presented in this article.*
