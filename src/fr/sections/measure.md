# Mesurer l'impact environnemental de l'IA générative

## Etat de l'art

Aujourd'hui, des modèles d'IA sont mis à disposition de manière open source par des organismes privés comme Meta, Mistral, Google, Deepseek, Qwen ou Kimi. Il est donc techniquement possible de mesurer directement leur consommation énergétique.

Par exemple, le ML.ENERGY leaderboard [@chung2025mlenergybenchmarkautomatedinference] mesure directement la consommation électrique des modèles à l'aide de son outil Zeus [@zeus-nsdi23]. Ces deux initiatives sont citées par OpenAI [@openai_academy_environmental_impact_ai].

D'autres articles tentent de réaliser cette mesure à travers des estimations sur l'infrastructure. Une petite requête consommerait 0,42 Wh [@jegham2025hungryaibenchmarkingenergy].

Cependant, les modèles les plus performants sont détenus par OpenAI, Google ou Anthropic. Ils ne communiquent aucune donnée sur les caractéristiques de leurs modèles, et encore moins sur leur impact environnemental.
De plus, ces modèles sont principalement accessibles via des API qui empêchent la mesure directe de l'énergie, ce qui oblige à recourir à des approximations [@Luccioni_2024].
Google estime qu'en moyenne, une requête textuelle sur Gemini Apps consomme 0,24 wattheure (Wh) d'énergie, émet 0,03 gramme d'équivalent dioxyde de carbone (gCO₂e) et consomme 0,26 millilitre (soit environ cinq gouttes) d'eau. L'impact énergétique par requête équivaut à regarder la télévision pendant moins de neuf secondes [@elsworth2025measuringenvironmentalimpactdelivering]. Cependant, Google ne précise pas le nombre exact de tokens d'entrée et de sortie utilisés pour son prompt médian.

Certains acteurs ont tenté d'estimer l'impact environnemental des modèles fermés de différentes manières.
Une analyse indépendante d'Epoch AI estime qu'une requête classique sur ChatGPT utilisant GPT-4o consommerait **~0,3 Wh** [@epoch_gradient_updates]. Cette valeur est contredite par OpenAI sans justification [@openai_academy_environmental_impact_ai].

Le PDG d’OpenAI a révélé qu’une requête moyenne adressée à ChatGPT consommait environ 0,34 Wh d’énergie et 0,3 mL d'eau [@altman2025gentle]. Cette information ne fournit aucune explication quant au périmètre de mesure ou à la méthodologie utilisée pour parvenir à ce chiffre, ce qui rend impossible toute comparaison avec d’autres estimations ou toute compréhension des composants qui ont été pris en compte.

D'autres acteurs non lucratifs comme Ecologits ont développé une méthode d'estimation couvrant un large périmètre, basée sur des estimations pour les modèles fermés [@Rince2025] ou sur le LLM Perf Leaderboard d'HuggingFace [@huggingface_llm_perf_leaderboard].

La SNCF, en partenariat avec Résilio et Wavestone, a récemment développé une autre méthode d'estimation, couvrant un périmètre encore plus large [@sncf_impactia_2026].

Cependant, bien qu'on ne puisse douter du professionnalisme de ces organismes, ces estimations sont à prendre avec des pincettes car, grandement basées sur des hypothèses difficilement vérifiables.
Par exemple, une étude [@DEVRIES20232191] citée 526 fois, notamment dans des articles de revues scientifiques sérieuses comme Nature [@Xiao2025], se base sur une citation d'un membre de la direction d'Alphabet (Google) sans preuve à l'appui [@dastin2023focus].

## Outils et Calculateurs

Pour aider à mesurer l'impact environnemental de l'IA, des outils et calculateurs ont été développés :

### Ma calculatrice de l'impact environnemental de votre conversation avec l'IA

Développée spécialement pour cet article, cette calculatrice est conçue pour être simple d’utilisation et accessible au grand public.
Elle est basée sur un périmètre restreint de la méthodologie d'Ecologits dans lequel certaines valeurs hypothétiques ont été remplacées par des valeurs mesurées. Des variables supplémentaires ont également été ajoutées afin de mettre en évidence les leviers permettant de réduire l’empreinte environnementale globale.

**Testez-la dès maintenant** en copiant-collant quelques extraits de votre dernière conversation avec une IA : <https://felixmortas.com/ai-inf-calculator>

Cette calculatrice, comme toute méthode d’estimation, présente des limites :

- Elle ne prend pas en compte les tokens de raisonnement invisibles. Une prochaine version pourrait estimer leur proportion par rapport au nombre de tokens de sortie visibles, en fonction du niveau d’effort de raisonnement.
- Les agents conversationnels effectuent probablement plusieurs passes de traitement, notamment lors de boucles. Le texte d’entrée peut donc être traité plusieurs fois. Le modèle ne prend pas en compte ces boucles ni le retraitement des tokens qu’elles impliquent.
- Le coût énergétique d'un token de sortie dépend du nombre de tokens générés précédemment. Dans le modèle, on suppose que tous les tokens de sortie ont le même coût énergétique

### D'autres bons outils

- Zeus Project par ML.ENERGY : pour mesurer directement l'énergie consommée sur la machine [@zeus-nsdi23], et le ML.ENERGY Leaderboard pour comparer la consommation énergétique des modèles ouverts [@chung2025mlenergybenchmarkautomatedinference].
- Un modèle de données ouvertes et interconnectées pour construire des scénarios d'empreinte carbone, améliorant la qualité et la transparence des données dès la conception [@ruf2023openlinkeddatamodel].
- CodeCarbon : une bibliothèque Python pour mesurer en direct la consommation énergétique de la machine (ordinateur personnel et même serveur) [@courty2026codecarbon]. Attention, car elle ne prend pas en compte le code exécuté à travers des API.
- EcoLogits par CodeCarbon : un calculateur web et une bibliothèque Python pour estimer l'empreinte carbone de l'IA générative à travers l'API, en utilisant le token comme unité de mesure [@ecologits_calculator]. L'outil se couple très bien avec CodeCarbon.
- Impact'IA par la SNCF : un calculateur avec un périmètre plus large qu'Ecologits, mais avec de nombreuses hypothèses qui augmentent considérablement l’incertitude [@sncf_impactia_2026].
- LLM Perf Leaderboard par Hugging Face : un comparateur des performances de modèles ouverts, incluant l'énergie par token généré [@huggingface_llm_perf_leaderboard].
- Parfois, il est impossible de mesurer directement la consommation énergétique des machines. Cependant, celle-ci est très liée au temps d'exécution du modèle [@Zschache2026], ce qui en fait un paramètre utilisable pour mesurer l'impact environnemental d'un LLM hébergé.
- D'autres ressources comme des outils ou articles sont regroupés sur le dépôt Github [@rince_awesome_green_ai] d'un membre de l'organisation CodeCarbon : <https://github.com/samuelrince/awesome-green-ai>
