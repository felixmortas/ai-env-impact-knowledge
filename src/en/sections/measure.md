# Measuring the Environmental Impact of Generative AI

## State of the Art

Today, AI models are made available as open-source or open-weights (downloadable, but with a confidential design process) by private organizations such as Meta, Mistral, Google, DeepSeek, or Alibaba. It is therefore theoretically possible to measure their environmental footprint with certainty.

For example, the ML.ENERGY Leaderboard [@chung2025mlenergybenchmarkautomatedinference] directly measures the electricity consumption of models using its Zeus tool [@zeus-nsdi23]. This initiative is even cited by OpenAI [@openai_academy_environmental_impact_ai].

However, the most powerful models are currently owned by OpenAI, Google, and Anthropic. 
These proprietary models are mainly accessible through APIs, which prevent external organizations from directly measuring their energy use.
Google estimates that a median Gemini query consumes 0.24 Wh of energy, emits 0.03 gCO₂e, and consumes 0.26 mL (about five drops) of water. The energy impact per query is equivalent to watching television for less than nine seconds [@elsworth2025measuringenvironmentalimpactdelivering].
OpenAI's CEO claims that an average ChatGPT query consumes about 0.34 Wh of energy and 0.3 mL (6 drops) of water [@altman2025gentle]. 
However, neither provider specifies the exact number of tokens per prompt, nor the number of parameters of the models used. This lack of transparency makes it impossible to interpret these values rigorously or to compare the impact of models.

Some players try to estimate the environmental impact of closed models by relying on approximations [@Luccioni_2024]. Independent analyses estimate that a query consumes between **0.3 and 29 Wh** [@epoch_gradient_updates ; @jegham2025hungryaibenchmarkingenergy].

Other nonprofit players have developed estimation methods covering a broad scope, based on estimates for closed models [@Rince2025 ; @sncf_impactia_2026] or on real data measured on open models [@huggingface_llm_perf_leaderboard].

However, although the professionalism of these organizations is not in question, these estimates must be interpreted with caution because they rely largely on assumptions that are difficult to verify.
For example, a study [@DEVRIES20232191] cited 526 times, including in articles from reputable scientific journals such as Nature [@Xiao2025], is based on a quote from a member of Alphabet's (Google's) leadership with no supporting evidence [@dastin2023focus].

## Tools and Calculators

To help you try to measure the environmental impact of generative AI, tools and calculators have been developed:

### My Calculator for the Environmental Impact of Your Conversation with AI

Developed specifically to illustrate the best practices shared in the next chapter of this article, this calculator is designed to be simple to use and accessible to the general public.
It is based on a restricted scope of the Ecologits methodology in which some hypothetical values have been replaced with measured values. Additional variables have also been added to highlight the levers for reducing the user's environmental footprint.

**Try it right now** by copying and pasting a few excerpts from your last conversation with an AI: [https://felixmortas.com/ai-inf-calculator](https://felixmortas.com/ai-inf-calculator)

This calculator, like any estimation method, has limitations:

- It does not account for invisible reasoning tokens. A future version could estimate their proportion relative to the number of visible output tokens, depending on the reasoning effort level.
- Conversational agents probably perform multiple processing passes, particularly in loops. The input text may therefore be processed several times. The calculator accounts for neither these loops nor the reprocessing of tokens they involve.
- The energy cost of an output token depends on the number of tokens previously generated. In the calculator, all output tokens are assumed to have the same energy cost [@vartziotis2026tokenswatthoursanalyticalenergy].

### Other Good Tools

- Zeus Project by ML.ENERGY: to directly measure the energy consumed on the machine [@zeus-nsdi23], and the ML.ENERGY Leaderboard to compare the energy consumption of open models [@chung2025mlenergybenchmarkautomatedinference].
- An open, interlinked data model for building carbon footprint scenarios, improving data quality and transparency by design [@ruf2023openlinkeddatamodel].
- CodeCarbon: a Python library to measure the machine's energy consumption (personal computer or server) in real time [@courty2026codecarbon]. Be careful, as it does not account for code executed through APIs.
- EcoLogits by CodeCarbon: a web calculator and Python library to estimate the carbon footprint of generative AI through APIs, using the token as the unit of measurement [@ecologits_calculator]. The tool works well in synergy with CodeCarbon.
- Impact'IA by SNCF: a calculator with a broader scope than Ecologits, but with many assumptions that considerably increase the uncertainty [@sncf_impactia_2026].
- LLM Perf Leaderboard by Hugging Face: a performance comparator for open models, including energy per generated token [@huggingface_llm_perf_leaderboard].
- Other resources such as tools or articles are collected in the GitHub repository [@rince_awesome_green_ai] of a member of the CodeCarbon organization: [https://github.com/samuelrince/awesome-green-ai](https://github.com/samuelrince/awesome-green-ai)
- Sometimes, it is impossible to directly measure the energy consumption of machines. However, it is closely tied to the model's execution time [@Zschache2026], which makes it a usable parameter for measuring the environmental impact of a hosted LLM.
