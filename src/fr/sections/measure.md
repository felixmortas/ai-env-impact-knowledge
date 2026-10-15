# Mesurer l'impact environnemental de l'IA générative

## État de l'art

Aujourd'hui, des modèles d'IA sont mis à disposition de manière open-source ou open-weights (téléchargeables, mais dont le processus de conception est confidentiel) par des organismes privés comme Meta, Mistral, Google, DeepSeek ou Alibaba. Il est donc théoriquement possible de mesurer leur empreinte environnementale avec certitude.

Par exemple, le ML.ENERGY Leaderboard [@chung2025mlenergybenchmarkautomatedinference] mesure directement la consommation électrique des modèles à l'aide de son outil Zeus [@zeus-nsdi23]. Cette initiative est même citée par OpenAI [@openai_academy_environmental_impact_ai].

Cependant, les modèles les plus performants sont aujourd'hui détenus par OpenAI, Google et Anthropic. 
Ces modèles propriétaires sont principalement accessibles via des API qui empêchent la mesure directe de l'énergie par des organismes externes.
Google estime qu'une requête médiane sur Gemini consomme 0,24 Wh d'énergie, émet 0,03 gCO₂e et consomme 0,26 mL (soit environ cinq gouttes) d'eau. L'impact énergétique par requête équivaut à regarder la télévision pendant moins de neuf secondes [@elsworth2025measuringenvironmentalimpactdelivering].
Le PDG d’OpenAI affirme qu’une requête moyenne adressée à ChatGPT consomme environ 0,34 Wh d’énergie et 0,3 mL (6 gouttes) d'eau [@altman2025gentle]. 
Cependant, aucun des deux fournisseurs ne précise le nombre exact de tokens par prompt, ni le nombre de paramètres des modèles utilisés. Ce manque de transparence ne permet donc pas d'interpréter ces valeurs avec rigueur ni de comparer l’impact des modèles.

Certains acteurs tentent d'estimer l'impact environnemental des modèles fermés en recourant à des approximations [@Luccioni_2024]. Des analyses indépendantes estiment qu'une requête consomme entre **0,3 et 29 Wh** [@epoch_gradient_updates ; @jegham2025hungryaibenchmarkingenergy].

D'autres acteurs non lucratifs ont développé des méthodes d'estimation couvrant un large périmètre, basées sur des estimations pour les modèles fermés [@Rince2025 ; @sncf_impactia_2026] ou sur des données réelles mesurées sur des modèles ouverts [@huggingface_llm_perf_leaderboard].

Cependant, bien que le professionnalisme de ces organismes ne soit pas remis en cause, ces estimations doivent être interprétées avec prudence car elles reposent en grande partie sur des hypothèses difficilement vérifiables.
Par exemple, une étude [@DEVRIES20232191] citée 526 fois, notamment dans des articles de revues scientifiques sérieuses comme Nature [@Xiao2025], se base sur une citation d'un membre de la direction d'Alphabet (Google) sans preuve à l'appui [@dastin2023focus].

## Outils et calculateurs

Pour vous aider à tenter de mesurer l'impact environnemental de l'IA générative, des outils et calculateurs ont été développés :

### Ma calculatrice de l'impact environnemental de votre conversation avec l'IA

Développée spécialement pour illustrer les bonnes pratiques partagées dans le prochain chapitre de cet article, cette calculatrice est conçue pour être simple d’utilisation et accessible au grand public.
Elle est basée sur un périmètre restreint de la méthodologie d'Ecologits dans lequel certaines valeurs hypothétiques ont été remplacées par des valeurs mesurées. Des variables supplémentaires ont également été ajoutées afin de mettre en évidence les leviers permettant de réduire l’empreinte environnementale de l'utilisateur.

**Testez-la dès maintenant** en copiant-collant quelques extraits de votre dernière conversation avec une IA : [https://felixmortas.com/ai-inf-calculator](https://felixmortas.com/ai-inf-calculator)

Cette calculatrice, comme toute méthode d’estimation, présente des limites :

- Elle ne prend pas en compte les tokens de raisonnement invisibles. Une prochaine version pourrait estimer leur proportion par rapport au nombre de tokens de sortie visibles, en fonction du niveau d’effort de raisonnement.
- Les agents conversationnels effectuent probablement plusieurs passes de traitement, notamment lors de boucles. Le texte d’entrée peut donc être traité plusieurs fois. La calculatrice ne prend pas en compte ces boucles ni le retraitement des tokens qu’elles impliquent.
- Le coût énergétique d'un token de sortie dépend du nombre de tokens générés précédemment. Dans la calculatrice, on suppose que tous les tokens de sortie ont le même coût énergétique [@vartziotis2026tokenswatthoursanalyticalenergy].

### D'autres bons outils

- Zeus Project par ML.ENERGY : pour mesurer directement l'énergie consommée sur la machine [@zeus-nsdi23], et le ML.ENERGY Leaderboard pour comparer la consommation énergétique des modèles ouverts [@chung2025mlenergybenchmarkautomatedinference].
- Un modèle de données ouvertes et interconnectées pour construire des scénarios d'empreinte carbone, améliorant la qualité et la transparence des données dès la conception [@ruf2023openlinkeddatamodel].
- CodeCarbon : une bibliothèque Python pour mesurer en direct la consommation énergétique de la machine (ordinateur personnel ou serveur) [@courty2026codecarbon]. Attention, car elle ne prend pas en compte le code exécuté à travers des API.
- EcoLogits par CodeCarbon : un calculateur web et une bibliothèque Python pour estimer l'empreinte carbone de l'IA générative à travers les API, en utilisant le token comme unité de mesure [@ecologits_calculator]. L'outil synergise bien avec CodeCarbon.
- Impact'IA par la SNCF : un calculateur avec un périmètre plus large qu'Ecologits, mais avec de nombreuses hypothèses qui augmentent considérablement l’incertitude [@sncf_impactia_2026].
- LLM Perf Leaderboard par Hugging Face : un comparateur des performances de modèles ouverts, incluant l'énergie par token généré [@huggingface_llm_perf_leaderboard].
- D'autres ressources comme des outils ou articles sont regroupés sur le dépôt GitHub [@rince_awesome_green_ai] d'un membre de l'organisation CodeCarbon : [https://github.com/samuelrince/awesome-green-ai](https://github.com/samuelrince/awesome-green-ai)
- Parfois, il est impossible de mesurer directement la consommation énergétique des machines. Cependant, celle-ci est très liée au temps d'exécution du modèle [@Zschache2026], ce qui en fait un paramètre utilisable pour mesurer l'impact environnemental d'un LLM hébergé.
