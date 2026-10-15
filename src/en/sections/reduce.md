# Reducing your environmental impact by adopting best practices

In this chapter, you will discover which best practices to adopt to reduce your environmental impact related to AI, and why applying them can even improve your efficiency.

There are best practices suited to two categories of audience:

- **The end user**: they concern how the AI application is used.
- **The AI developer**: they influence how the AI application works.

In both cases, these best practices aim to **minimize your ecological footprint** while **optimizing your performance**.

Some organizations, such as the UN, also propose reduction levers that will be presented in this chapter [@aczel2026environmental].

## As a chatbot user

### Prioritize a search on a search engine

If the answer you expect to your question is simple (for example, the population of a city or the family of a plant), favor a search on a search engine (Google, Ecosia, Bing, Qwant, Brave, DuckDuckGo).

If you have the habit of phrasing your question to your chatbot with keywords to save time, be aware that you can type these keywords directly into your search engine. The answer will be just as fast and available through several sources.
*Examples: "Largest planet solar system", "speed of light".*

Google estimated that an average search on its search engine consumed **0.3 Wh** of energy and emitted 0.2 gCO₂e in 2009 [@holzele2009powering], but this value is certainly no longer valid. A recent study estimates the new values at 0.03 Wh and 0.02 gCO₂e, which is 10x less than before [@vanderbauwhede2025estimatingincreaseemissionscaused].
For comparison, Mistral AI estimates that a request sent to its Mistral Large 2 model with 400 output tokens emits 1.14 gCO₂e [@mistralai2025environmental].

**Warning**: In your searches with Google or other engines, the **automatic AI search feature (AI Overview)** is enabled by default. You must disable it in the settings for this best practice to be valid and choose for yourself when to use AI for your searches.

### Use a model with few activated parameters

When using a chatbot, favor **the smallest model**, with the fewest activated parameters. It is sufficient to perform many tasks accurately [@chen2023frugalgptuselargelanguage ; @cao2026taskspecificefficiencyanalysissmall].

Most AI providers disclose neither the exact name of the model used nor the number of parameters it contains. However, to guide you, be aware that models with names like *"flash"*, *"lite"*, *"fast"*, *"nano"*, *"mini"*, *"quick"* or *"small"* are generally the ones that activate **the fewest parameters per processed token**.

**Recommendations for choosing your model based on the task to perform:**
- Small: delve deeper into a topic, rephrase or summarize a text, generate a snippet of basic code, classify, extract text.
- Intermediate: plan, design an architecture, generate code within a project, perform non-standardized processing.
- Large: solve a complex problem in mathematics, science or engineering, design a complex architecture, carry out complex planning, analyze voluminous files with contradictory sources.

As you may have gathered: large models are oversized for many use cases.

With GPT-5 models on ChatGPT, you cannot manually choose the model used. A first model, called a *"router"*, automatically determines the size of the model that will process your message.
For free users, all requests are sent to the smallest model [@openai2026gpt56sol].

To encourage the router to send your message to a particular model, you can include keywords such as:
*"Answer simply"* or *"Without reasoning"* to use a small model.
*"Think step by step"* or *"Reason before answering"* to use a more powerful model or reasoning [@anthropic2025prompt].

### Reduce the thinking effort

It is recommended to **use the reasoning feature** only when the answer to your request requires a complex, non-trivial analysis and must be broken down into several steps to guarantee the best possible quality. You can choose whether or not to enable reasoning on the Google, DeepSeek and Mistral chatbots.

Some models, such as GPT or Claude, allow you to set different effort levels. This setting determines the number of reasoning and output tokens it generates. While longer reasoning is often considered to lead to better results, this is not always the case. Performance tends to improve at first as effort increases, before reaching an optimal point and then, in some cases, decreasing beyond that threshold [@wu2025lessunderstandingchainofthoughtlength].
It is therefore preferable to favor a low to moderate effort level.

### Prompt engineering

This section explains the importance of *prompt/context engineering*: **how to provide useful context to the chatbot while eliminating noise** (that is, unnecessary information) so that it accomplishes its task accurately and generates a response in the desired format.

According to the main model providers, including OpenAI [@openai_prompt_engineering], the optimal structure of a prompt relies on several key elements, notably:

1. **Context**: Often the longest part, which can be **greatly reduced** to minimize the number of input tokens and clarify the request.
2. **Task**: Generally formulated in one sentence.
3. **Deliverable**: Short, but essential to **limit the number of output tokens**.

#### Optimize the context to reduce input tokens

We saw earlier that input tokens also influence the energy consumption of the request [@ruf2026cost]. It is therefore recommended to limit the context to reduce the environmental impact, but also to improve the quality of the response.

#### Optimize the deliverable to reduce output tokens

We saw earlier that **the energy impact of tokens generated as output is greater than that of input tokens** [@Caravaca2026]. It is therefore generally more energy-efficient to **lengthen the prompt sent** in an attempt to reduce the length of the response.

In most cases, **a short and concise response is enough** and avoids getting lost in unnecessary explanations.

**Examples of instructions to limit the length of the response:**
- To correct spelling mistakes in a long text:
  *"Only indicate the corrections to make, without explanations and without copying the entire text."*
- To fix code:
  *"Only rewrite the parts to modify without reproducing all of the code. Do not provide explanations."*
- To rephrase a paragraph in a text:
  *"Only rewrite the paragraph to modify, without copying the rest of the text."*

It is up to you to determine what you need to get **the expected response, and nothing more if it is not necessary**.

**Tip**: Some chatbots, such as Claude, let you select the type of response. Favor the *"short"* or *"concise"* options.

Conversely, the use of certain action verbs such as "justify," "explain," "analyze" or "recommend" tends to increase the amount of text generated [@adamska2026greenpromptingcharacterizingpromptdriven].

### Stop the generation

If, right from the start of the chatbot's response, you see that it does **absolutely not** match what you expect, **interrupt it immediately** by clicking the *"Stop"* button (generally represented by a filled square ⏹️).

This simple action **reduces the number of output tokens generated** by avoiding a useless response.

### Edit the initial request rather than sending a new message

When the generated response is **incomplete, interrupted or unsatisfactory** (an element forgotten in the context, an imprecise detail, a part to remove), **prefer editing the initial message** rather than sending a new one to refine your request.

With each new message sent, **the entire conversation history is sent again** to the model. This considerably increases the number of **input tokens**, and therefore the environmental impact.
Moreover, an overly long history introduces **noise** (unnecessary information), reducing the quality of the responses. **The more limited and relevant the input tokens are, the better the chatbot's response will be**.

**Concrete example**:
If the chatbot's response does not take an important element into account, **do not send a new message** asking it to start its response over while taking an additional parameter into account.
**Prefer editing the initial message** to integrate this detail. That way, the response will be regenerated with a more complete context, **without making the history heavier**.

**Special case: small corrections**
If the response is **long and requires only a small modification**:

- **Do not edit the initial prompt**: this would regenerate a full response and have a greater impact related to *output* tokens.
- **Ask the chatbot to correct only the relevant part** without rewriting everything.
  *Example:* *"Only correct the third paragraph, without copying the rest of the text."*

This best practice requires finding the **best compromise** between:

- **Regenerating a response** by editing the initial message, which keeps the context concise but may generate more **output tokens**;
- **Adding a message**, which reduces **output tokens** but increases the amount of **input tokens** with each new message.

### Conversation engineering: create branches

To maintain a **minimal and useful** context, an effective technique is to **create branches in a conversation**.
Not all the information exchanged with the chatbot is necessarily useful for answering a new request.

If you ask the chatbot to clarify something in its response, but your next message **does not need that clarification**, it is better to **edit the initial question** rather than add it to the conversation. This way you can create **distinct branches for each topic** while limiting the context to the strict minimum.

**Concrete example:**

1. You ask a chatbot a question on a specific topic.
2. It answers by addressing several points, some of which are unclear to you.
3. You ask it to go deeper on **point 1**.
4. To then go deeper on **point 2**, you **edit the initial prompt** to ask it directly for explanations on that point, rather than asking a new question in the conversation.
5. Finally, if you want to take action based on the initial response, ask it to **plan the project by editing the prompt dedicated to point 2**, rather than sending a new question.

At this stage, your conversation has **3 branches**:

- The **first**: your initial question on the topic, and a deeper look at **point 1** that you had not understood.
- The **second**: your initial question on the topic, and a deeper look at **point 2** that you had not understood.
- The **third**: your initial question on the topic, and the planning request.

Each branch therefore deals with a **specific aspect of the project**, making it possible to:

- Keep a **single conversation** for the whole project.
- Avoid the context being **polluted by unnecessary information**.
- **Save the number of tokens** sent to the model.
- Create a **hierarchical and specialized prompting method**.

![Example tree structure of the branches of a conversation with a chatbot](images/conv-branching-diagram.png){width=80%}

### Create a new conversation for each new topic

We saw that each new message sent causes the **entire conversation history to be sent again** to the chatbot. It is therefore preferable to **start a new conversation** when you want to address a topic unrelated to the previous one [@Ruf_2025].

You have two options:

1. **Create a new conversation** dedicated to the new topic.
2. **Edit the first message** of the existing conversation to introduce the new topic.

By choosing the second option, you **reduce the number of conversations** in your history, which helps maintain a **clean and organized environment**.

You can also **reuse a chatbot's response** by injecting it into a **new conversation** dedicated to another task, rather than continuing in the initial discussion.
Once again, this approach **limits the size of the context**.

### Delete unnecessary conversations

When you send a message to a chatbot, before even your message history, several elements are included: the developer *prompt*, the system *prompt*, contextual information (country, time, language, browser, etc.), as well as a **summary of each of your saved conversations** [@mane2026context]. These summaries add context that is not always useful for the chatbot. **Delete your old conversations** when they are no longer useful to you.

### Clear the long-term memory

When you ask a chatbot to remember a piece of information during a conversation, it will systematically be included in new discussions. This is called **long-term memory** [@openai2024memoire]. To optimize it, use the dedicated menu if there is one; otherwise, create a dedicated conversation in which you ask the chatbot to **list the information it has memorized**, then delete what is no longer relevant.

## As a company developing an agent

### Prioritize algorithms and classical AI over generative AI

When it is enough, favor less complex technologies.
In many cases, simple decision algorithms or classical prediction or classification AI are sufficient.

### Use small specialized models

We saw earlier that the number of activated parameters of a model has a significant influence on the environmental impact of processing a token.

Prioritize small, specialized models. This sometimes even yields more accurate results than large generalist models [@cao2026taskspecificefficiencyanalysissmall ; @li2024smalllanguagemodelsapplication]
Models already specialized on a task through fine-tuning are made available on Hugging Face. Favor them rather than carrying out new fine-tuning.

### Prompt engineering to reduce the number of output tokens

In the same way that the user can limit output tokens, the developer can explicitly specify the expected form of the response in the *system prompt*. The model takes it into account even before the user's first request, and it systematically reduces the number of output tokens.

### Context engineering to reduce the number of input tokens

Many techniques exist to **limit the context** by keeping only the useful information.

**Examples:**
- After a conversation of 10 messages, a small model can be called on to **summarize the exchanges**. This summary can replace the history in subsequent exchanges.
- **In a multi-step process**, the steps can be **broken down** so as to provide the model with **only the strictly necessary information** at each step.

You can devise many other methods to **limit the context sent to the model**.

### Fine-tuning vs Few-shots-examples

For a model to produce an output that matches expectations, it is possible to add examples or to perform *fine-tuning*.
If the agent will not be used intensively*, it is recommended to *add examples to the context** (*one-shot* or *few-shots*). On the other hand, for massive use, it is preferable to reduce the number of input tokens by using *fine-tuning*. It lets the model understand the type of response expected **without needing to be given examples with every request**. However, *fine-tuning* has a **high environmental and financial cost**.

**Choosing between *few-shots* and *fine-tuning***
To determine the threshold beyond which *fine-tuning* becomes more cost-effective, you can:
1. Convert the instructions for the task and the *few-shots* into tokens.
2. Estimate the cost per request based on this number of tokens.
3. Compare the cumulative cost of all requests **with** *few-shots* to the cost of all those **without** *few-shots* plus the fixed cost of *fine-tuning*.

When the total cost of requests **without** *few-shots* plus *fine-tuning* is lower than that of requests **with** *few-shots*, opt for *fine-tuning*.

### Host the model in a data center with low energy and water impact

When you decide to host your model yourself with a public cloud provider, you can select a region with a **good energy and water score**: low emission factor, low PUE and WUE all year round. 

#### Carbon emissions perspective
Referring to the data provided by Ember Energy, preselect a country with a low emission factor such as Iceland, Norway, Switzerland or France.

The main cloud providers list the location of their data centers by region:
- Amazon Web Services: [https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/](https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/)
- Microsoft Azure: [https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all](https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all)
- Google Cloud Platform: [https://datacenters.google/locations/](https://datacenters.google/locations/)
- Salesforce: [https://help.salesforce.com/s/articleView?id=000396845&type=1](https://help.salesforce.com/s/articleView?id=000396845&type=1)
- OVH: [https://www.ovhcloud.com/en/datacenter/](https://www.ovhcloud.com/en/datacenter/)

Once the region is preselected, take the provider's PUE into account.
You can find these values by region for the main cloud providers:

- **Amazon Web Services**: [https://sustainability.aboutamazon.com/products-services/aws-cloud](https://sustainability.aboutamazon.com/products-services/aws-cloud)
- **Microsoft Azure**: [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/)
- **Google Cloud Platform**: [https://datacenters.google/efficiency/](https://datacenters.google/efficiency/)
- **OVH**: [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf)

#### Water consumption perspective
Check that the preselected region is not at risk of drought.
To assess risks related to water availability, the **World Resources Institute (WRI)** offers a map of regions at high risk of drought: [https://www.wri.org/aqueduct/tools](https://www.wri.org/aqueduct/tools).

Finally, look at the WUE. When this indicator is missing, consider the WUE of another provider's region:

- **Amazon Web Services**: [https://sustainability.aboutamazon.com/products-services/aws-cloud/](https://sustainability.aboutamazon.com/products-services/aws-cloud/) ;
- **Microsoft Azure**: [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/) ;
- **Google Cloud Platform**: link [https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf](https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf) ;
- **OVH**: [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf).

### Inference engine

Some providers optimize their models for specific inference engines [@nvidia2026llminference]. The appropriate engine may be indicated in the model card.

### Use the cache

The **cache** feature stores and reuses the attention computations as well as the tokens of a prompt that has already been processed, thus avoiding recomputing everything with each request.

**Use cases optimized with the cache**:

- **Repetition of a large context**: for example when you frequently send the same documentation in the context, or the full history of a conversation (the case of a chatbot).
- **Autonomous agents**: agents making successive calls relying on the same **system prompt** (base instructions, available tools, guidance examples) and a shared state.
- **Code assistants**: analysis of a large code repository that is identical with every message.

For a cache to be effective, requests must be close together in time and the prompt prefix (the part to be cached) must be **strictly identical** from one request to the next. The slightest space or character changed at the beginning of the text will invalidate all or part of the existing cache.

### Batch processing

**Batch processing** consists of sending a large number of requests to be processed simultaneously. This method optimizes model inference and **significantly reduces** the energy and financial cost [@poddar2025sustainablenlpinsightsbenchmarking].

Model providers via API generally offer *batch processing* at **half price** compared to standard processing. Although there is no precise data in the literature quantifying this reduction, it can be assumed that the price variation is correlated with that of the energy impact.

Periodically send all requests **in a batch** if you do not need the model's responses in **real time**, the **volume of requests is large** and they are **independent** of one another.

### Recent models

**Stay informed** about new models because some may offer performance equivalent to that of your current model **while having a lower impact**, thanks to an optimization or an innovation.

![Major LLMs ranked by their capabilities, according to the number of parameters used for their training](images/Major-Large-Language-Models.png){width=80%}

*Global overview of LLMs and their performance [@david2025llm]*

For image generation, for example, one study suggests that the choice of model type should take into account the expected output length: autoregressive models (the most widely used) remain preferable for short responses (fewer than 1024 tokens), while diffusion models offer undeniable advantages for longer generation tasks [@ruf2026diffusion].

Be careful: changing models can trigger a new development phase (evaluation, fine-tuning) involving a significant environmental impact.
Moreover, optimizing a technology tends rather to increase its overall impact because it becomes inexpensive and is therefore used much more. This is the rebound effect [@jevons1865coal].

#### "Quantization": reducing the precision of calculations reduces energy needs

"Quantizing" a model consists of reducing the precision of its calculations. It goes from floating-point numbers to integers. By reducing the precision of calculations, it is possible, under certain conditions, to reduce the amount of energy consumed by the model [@delavande2026understandingefficiencyquantizationbatching; @poddar2025sustainablenlpinsightsbenchmarking].
Of course, this reduction in decimals leads to a loss of precision in the calculations. But today, it is possible to use "quantized" models while maintaining very good performance.

#### Distillation: when the student surpasses the master

One technique for reducing the size of models and, consequently, their impact at runtime, is knowledge distillation.
This is the technique that was used to create DeepSeek with a fraction of the energy cost of ChatGPT [@young2025deepseek].
It consists of using a very large teacher model to generate data that will then be used to refine the training of another, much smaller model, called the student model. The student model can thus acquire knowledge similar to that of its teacher, while requiring far fewer resources to run [@jiao-etal-2020-tinybert].

#### Pruned models (Pruning)

Pruning consists of removing parameters from the model. This technique greatly reduces size, and therefore the cost of running the model, while maintaining good performance [@ICLR2024_160adf2d].
