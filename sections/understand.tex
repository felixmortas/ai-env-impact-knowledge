# Facteurs influençant l'impact environnemental de l'IA générative

Les principaux impacts environnementaux liés à l'utilisation de l'IA que nous étudierons dans cet article sont les suivants :

- **Les émissions de gaz à effet de serre (GES)** liées à l'électricité et aux autres sources d'énergie nécessaires au fonctionnement des data centers qui font fonctionner les modèles d'IA. Dans le *GHG Protocol*, ces émissions peuvent être classées en différentes catégories (*Scopes*) selon leur origine : les émissions directement produites par l'entreprise (*Scope 1*), celles liées à l'électricité qu'elle achète (*Scope 2*) et, plus largement, les émissions indirectes qui ont lieu dans sa chaîne de valeur (*Scope 3*) [@ghgprotocol2004] ;
- **La consommation d'eau**, notamment l'eau utilisée pour refroidir les équipements informatiques des data centers.

D'autres facteurs existent, comme l'occupation des sols, la consommation de minéraux, les émissions de carbone liées à la fabrication du matériel, l'eutrophisation (pollution des milieux aquatiques), la toxicité humaine, l'appauvrissement de la couche d'ozone ou encore l'impact sur la biodiversité [@iso14040_2006]. Cependant, ils ne seront pas traités dans cet article.

En nous appuyant sur la littérature existante, nous explorerons comment **réduire notre impact environnemental** lié à l'utilisation de l'IA générative peut **améliorer l'efficacité** de nos pratiques.

## Qu'est-ce qui fait tourner ChatGPT ?

Dans un chatbot comme ChatGPT, un mécanisme permet de générer des réponses qui donnent l'impression d'une véritable conversation. C'est le LLM : Large Language Model. Il s'agit d'un modèle d'intelligence artificielle entraîné sur une très grande quantité de textes afin d'apprendre les caractéristiques et les relations entre les mots et les phrases. Son objectif principal est de prédire, à partir du contexte fourni, quels mots sont les plus susceptibles de venir ensuite.

## Les tokens

### Nombre de tokens de sortie proportionnel à la consommation d'énergie

Les LLM ne traitent pas directement des mots, mais des **tokens**. Un *embedder* (module d'intégration) décompose les mots en tokens avant le traitement. Une règle empirique utile consiste à considérer qu'un token correspond généralement à environ 4 caractères dans un texte anglais courant. Cela équivaut à environ les trois quarts d'un mot (ainsi, 100 tokens correspondent à environ 75 mots) [@openai2026tokenizer].

**Exemple** :
« Impacting the environment » se décompose en 4 tokens : « Impact / ing / the / environment »

Les fournisseurs de LLM utilisent généralement des *embedders* différents, ce qui signifie qu'un même texte peut être converti en un nombre variable de tokens selon le modèle.

Plus une IA générative doit traiter de tokens, plus elle consomme d'énergie. Par exemple, une requête qui nécessite de traiter **20 tokens** demandera théoriquement **deux fois plus d'énergie** qu'une requête qui traite **10 tokens**.

### Les tokens de sortie consomment généralement plus que les tokens d'entrée

Les tokens peuvent se diviser en deux catégories : les tokens d'entrée (aussi appelés tokens d'input, d'instruction, utilisateur ou encore tokens envoyés) et les tokens de sortie (aussi appelés tokens d'output, générés, de l'assistant ou tokens reçus).
Certaines études montrent que le traitement d'une requête avec un nombre de tokens en entrée très volumineux (par exemple, 50 000 tokens) ne consomme que très légèrement plus d'énergie totale que de petites requêtes [@Caravaca2026]. Cela laisse supposer que la consommation énergétique d'un token d'entrée est négligeable par rapport à un token de sortie.
En réalité, la différence de consommation entre un token d'entrée et un token de sortie va fortement varier en fonction de la taille totale de l'échange [@ruf2026cost; @vartziotis2026tokenswatthoursanalyticalenergy; @373c7a76c4004545bb3bb80df83f2932].

**Modèle simplifié** :
Une requête avec **100 tokens en entrée** et **50 tokens en sortie** consommera en théorie **moins d'électricité** qu'une requête avec **50 tokens en entrée** et **100 tokens en sortie**.

**Règle générale** : Moins une requête traite de tokens en sortie, moins elle consommera d'énergie. C'est pareil pour les tokens en entrée, mais de manière moins prononcée que pour les tokens de sortie.

### Tokens de raisonnement

Un modèle de raisonnement produit d'abord un texte de réflexion sur lequel il s'appuie pour élaborer sa réponse finale.
Les tokens générés par le modèle de **raisonnement** sont **non visibles** par défaut pour l'utilisateur. Un *token de raisonnement* consommant **autant d'énergie** qu'un *token de sortie*, ils augmentent le **nombre total de tokens traités** par le LLM, et donc sa consommation énergétique [@felipe2026reasoning].

Ainsi, nous comprenons que le nombre de tokens traités, en particulier les tokens de sortie, a un fort impact sur l'environnement.
Pour mesurer cet impact et quantifier son empreinte carbone, énergétique et hydrique, trois indicateurs clés peuvent être suivis, aussi bien pour les tokens d'entrée que pour les tokens de sortie :

- les émissions de gaz à effet de serre, exprimées en masse de CO$_2$ équivalent (t, kg, g, mg, etc.) ;
- la consommation d'énergie, exprimée en watt-heures (kWh, Wh, etc.) ;
- la consommation d'eau, exprimée en volume (m$^3$, L, mL, etc.).

## Choisir où héberger son modèle

### Les facteurs d'émission par pays

Une IA générative, comme un LLM (*Large Language Model*), est un programme exécuté sur un ordinateur. Cela peut être votre machine personnelle, mais cela se fait généralement dans des centres de données. Son fonctionnement nécessite de l'énergie, ce qui engendre un impact environnemental, mesuré ici en **gCO$_2$e/kWh**.

Les différents services permettant d'utiliser un LLM, et consommant de l'électricité, sont les suivants :

- **Hébergement dans un centre de données public** (Azure, AWS, GCP, Salesforce, etc.) : l'IA est exécutée sur des serveurs dans un centre de données (data center ou cloud) plutôt que directement sur votre ordinateur. Ces serveurs sont très puissants et permettent d'exécuter des modèles d'IA que vous avez téléchargés (par exemple depuis Hugging Face) ou que vous avez développés et entraînés vous-même. Dans ce cas, votre entreprise possède le modèle d'IA et choisit le fournisseur de cloud et la région géographique dans lesquels il sera exécuté.
- **Hébergement dans votre propre centre de données** : réservé aux entreprises, ce principe est similaire au cloud public : vous détenez le modèle et décidez de la localisation de la machine sur laquelle le déployer.
- **Via l'API de fournisseurs de modèles** (Anthropic, Google, MistralAI, OpenAI, Meta, Deepseek, Z.ai, Moonshot AI) ou d'agrégateurs (Groq, MammouthAI, Vercel, OpenRouter) : ici, vous ne contrôlez pas l'emplacement de l'hébergement. Le modèle peut être hébergé chez un fournisseur de cloud public (au nom du fournisseur ou de l'aggrégateur) ou dans un data center privé.
- **Sur votre propre ordinateur** : certains modèles récents et légers peuvent fonctionner directement sur une machine personnelle récente, tout en fournissant des performances compétitives avec les grands modèles propriétaires [@saadfalcon2026intelligencewattmeasuringintelligence]. Vous maîtrisez alors 100 % de la consommation électrique liée à son utilisation et pouvez utiliser l'IA générative hors connexion.

Chaque pays produit de l'électricité avec un impact environnemental variable. Pour générer **1 kWh**, une centrale émet des gaz à effet de serre (GES) et consomme de l'eau. Certaines bases de données, comme celles de l'**IEA** (normalement payante mais accessible gratuitement sur demande), de l'**ADEME** (gratuite, incluant les données de l'IEA de 2011) [@ademe2026], d'Ember Energy (gratuite, données provenant de plusieurs sources notamment IEA, Eurostat, BP, UN) [@ember_yearly_electricity_data] ou Spectrum IEEE [@jones2008water], fournissent ces informations par pays ou par type de production.

Un critère clé pour choisir son hébergeur cloud est donc la **localisation des serveurs**.

### Indice d'efficacité énergétique : le PUE

Un même serveur consomme la même quantité d'énergie, **quelle que soit sa localisation**. Cependant, la quantité d'énergie nécessaire pour maintenir une température optimale pour son bon fonctionnement varie en fonction de la température ambiante. Ainsi, selon l'environnement, il faudra plus ou moins d'énergie pour refroidir les machines et les maintenir à une température adaptée.

L'indicateur permettant de mesurer l'efficacité énergétique d'un data center, notamment pour le refroidissement et la maintenance de l'infrastructure, est le **PUE** (*Power Usage Effectiveness*) [@Malone2006]. Il représente le ratio entre :

- **la consommation totale du data center**,
- **la consommation liée uniquement à l'exécution des serveurs**.

**Formule :** PUE = Consommation énergétique totale du data center (kWh) / Consommation énergétique des serveurs (kWh)

Exemples :

- **PUE = 1** : Idéal, toute l'énergie est utilisée pour faire fonctionner les serveurs.
- **PUE > 1** : Le data center consomme également de l'énergie pour le refroidissement et le fonctionnement du bâtiment.
- **PUE = 2** : Le data center consomme autant d'énergie pour alimenter les serveurs que pour les refroidir et maintenir l'infrastructure.

Le PUE moyen mondial est de 1,54 [@taylor2026], quand celui de Google est de 1,09 [@google2026pue].

Le **PUE** des data centers doit donc être un critère clé dans le choix d'un fournisseur cloud.

### Les méthodes de refroidissement

Les data centers utilisent différentes techniques de refroidissement, dont voici les principales [@le_goff2023] :

- **Refroidissement direct par air extérieur** :
Possible dans les régions au climat frais, cette méthode ventile l'air extérieur pour refroidir les serveurs. Elle consomme de l'électricité principalement pour alimenter les ventilateurs et ne consomme pas d'eau.
- **Refroidissement adiabatique** :
L'air chaud extérieur est ventilé et refroidi par pulvérisation de fines gouttelettes d'eau qui s'évaporent. Cette technique consomme à la fois de l'électricité et de l'eau.
- **Refroidissement direct des puces (*Direct Chip Cooling*)** :
De l'eau circule dans des micro-tuyaux entre les processeurs pour les refroidir directement. Bien que l'eau ne soit pas consommée, elle doit être refroidie à un moment donné dans le circuit, ce qui nécessite souvent de l'électricité. De plus, cette eau peut être mobilisée par le data center pendant des périodes de forte demande (par exemple, pour l'arrosage agricole), ce qui peut poser des problèmes de concurrence d'usage.

### Consommation en eau

Le **WUE** (*Water Usage Effectiveness*) est un indicateur mesurant la quantité d'eau consommée par les data centers [@green_grid2011_wue].
Cette eau dîte consommée est en réalité évaporée dans l'atmosphère. L'eau prélevée et remise plus tard dans l'environnement n'est pas prise en compte dans le calcul de cet indice.

**Formule :** WUE (L/kWh) = Eau consommée (L) / Énergie consommée par les serveurs (kWh)

Quelques exemples de WUE :

| **WUE (L/kWh)** | **Source** | **Consommation d'eau annuelle (m$^3$)** | **Équivalent (piscines olympiques)** |
|:----------------|:-----------------------|----------:|------:|
| 0,12  | Amazon                | Inconnu   | --    |
| 0,255 | Microsoft             | 8 170 000 | 3 268 |
| 0,29  | OVH France Roubaix    | Inconnu   | --    |
| 0,19  | Meta Texas Fort Worth | 195 000   | 78    |

Table: WUE et consommation d'eau des fournisseurs de cloud {#tab:cloud-providers-wue}

Source : Rapports environnementaux

Les data centers placés dans des régions arides ont un WUE généralement plus élevé, et donc une consommation d'eau plus importante lors des périodes de forte chaleur. Cette consommation a un impact fort sur la disponibilité en eau pour d'autres usages essentiels, comme l'agriculture ou la consommation humaine.

## Nombre de paramètres du modèle

On mesure la taille d'un modèle de langage par son nombre de paramètres. **Plus un modèle compte de paramètres activés pendant son exécution, plus sa consommation énergétique est élevée**. Cette consommation est directement proportionnelle au nombre de paramètres : un modèle avec 200 milliards de paramètres consomme ainsi **deux fois plus d'électricité** qu'un modèle avec 100 milliards de paramètres [@mistralai2025environmental].
Cette règle ne s'applique pas nécessairement à tous les fournisseurs de modèles. En effet, chacun utilise des méthodes de conception différentes, ce qui peut avoir un impact sur la consommation énergétique [@Zschache2026]. Cependant, elle peut s'appliquer à tous les modèles d'une même famille : les modèles GPT-6 entre eux, les modèles Gemini 3 entre eux, etc.
Ainsi, même si cette règle n'est pas parfaitement fiable pour comparer les différents fournisseurs, elle reste un indicateur utile pour orienter le choix d'un modèle.

**Transparence des fournisseurs** :
Les modèles open source affichent leur nombre de paramètres. Mais celui des modèles des fournisseurs privés comme ChatGPT, Claude ou Gemini n'est jamais divulgué. Il est néanmoins possible de comparer la taille des modèles d'un même fournisseur grâce à leurs appellations : *nano, mini, lite, flash, small, medium, large, pro, plus, max*.
Certains chercheurs tentent quand même d'estimer ce nombre de paramètres en se basant sur différentes méthodes innovantes, comme la comparaison du volume de connaissance stocké [@li2026incompressibleknowledgeprobesestimating].

| **Model** | **Vendor** | **Est. params** |
|:------------------|:----------|:-----|
| gpt-5.5           | OpenAI    | 5.3T |
| claude-fable-5    | Anthropic | 3.5T |
| gemini-2.5-pro    | Google    | 3.0T |
| grok-4            | xAI       | 2.0T |
| claude-sonnet-4.6 | Anthropic | 760B |

Table: Estimation des paramètres de modèles propriétaires avec la méthode "Incompressible Knowledge Probes" [@li2026incompressibleknowledgeprobesestimating] {#tab:proprietary-model-parameters}

Source : <https://01.me/research/ikp/#/calibration#proprietary>

Il est également possible d'estimer la taille des modèles propriétaires en comparant leur prix à celui de modèles ouverts. Cependant cette méthode est très incertaine car la diminution du prix peut signifier une optimisation plutôt qu'une diminution du nombre de paramètres [@du2026tieredsupermooreslawprice].

### Modèles MoE (Mixture-of-Experts)

Un modèle **MoE** (*Mixture of Experts*) est un type de modèle qui n'utilise **pas l'intégralité de ses paramètres** lors de son exécution. Cela ne le rend pas moins performant ; au contraire, il active uniquement les paramètres nécessaires à la génération de la réponse. Par exemple, un modèle MoE de 300 milliards de paramètres peut n'en activer que 30 milliards, ce qui le rend **beaucoup moins énergivore** qu'un modèle dense de 100 milliards de paramètres [@mu2026comprehensivesurveymixtureofexpertsalgorithms].
Privilégier les modèles MoE avec un **faible nombre de paramètres activés** permet donc de limiter son impact environnemental.

### Modèles « quantizés »

La quantification consiste à réduire la précision des calculs d'un modèle. On passe de nombres avec beaucoup de chiffres après la virgule à des nombres sans aucun chiffre après la virgule. En réduisant la précision des calculs, on peut, dans certaines conditions, réduire la quantité d'énergie consommée par le modèle [@delavande2026understandingefficiencyquantizationbatching; @poddar2025sustainablenlpinsightsbenchmarking].
Bien sûr, cette réduction de chiffres après la virgule entraîne une perte de précision dans les calculs. Mais aujourd'hui, il est possible de « quantizer » un modèle en conservant une très bonne précision, réduisant ainsi son impact environnemental.

### Modèles distillés

Une technique permettant de réduire la taille des modèles et, par conséquent, leur consommation énergétique à l'exécution, est la distillation des connaissances.
C'est notamment cette technique qui a été utilisée pour créer DeepSeek, avec une fraction du coût énergétique de ChatGPT [@young2025deepseek].
Elle consiste à utiliser un modèle professeur, de très grande taille, pour générer des données qui serviront ensuite à affiner l'entraînement d'un autre modèle, appelé modèle élève, beaucoup plus petit. Le modèle élève peut ainsi acquérir des connaissances similaires à celles de son professeur, tout en nécessitant beaucoup moins de ressources pour son exécution [@jiao-etal-2020-tinybert].

### Modèles taillés (Pruning)

L'élagage (pruning) consiste à supprimer des paramètres du modèle. Cette technique permet de réduire fortement la taille, et donc le coût d'exécution des modèles tout en conservant de bonnes performances [@ICLR2024_160adf2d]. Cette réduction du nombre de paramètres et du coût d'exécution constitue un levier de réduction de la consommation énergétique.

## Moteurs d'inférence

La consommation énergétique d'un LLM pendant l'exécution n'est pas uniquement déterminée par le modèle lui-même : elle dépend également du moteur d'inférence utilisé [@niu2025inferenceengine].
Un moteur d'inférence, c'est en quelque sorte le logiciel qui fait fonctionner un LLM au moment où on lui pose une question.
Si le LLM était un moteur de voiture, le moteur d'inférence serait le système qui organise et contrôle son fonctionnement.
Certains fournisseurs optimisent leurs modèles pour certains moteurs d'inférence [@nvidia2026llminference].
