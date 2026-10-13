# Facteurs influençant l'impact environnemental de l'IA générative

Les principaux impacts environnementaux liés à l'utilisation de l'IA que nous étudierons dans cet article sont les suivants :

- **Les émissions de gaz à effet de serre (GES)** liées à l'électricité et aux autres sources d'énergie nécessaires au fonctionnement des data centers qui font fonctionner les modèles d'IA ;
- **La consommation d'eau** pour refroidir les équipements informatiques des data centers.

D'autres impactent pourraient être pris en compte mais comme le sujet manque encore un peu de maturité, nous nous limiterons aux à ces deux là.

## Les fondamentaux : Le Large Language Model (LLM)

Dans un chatbot comme ChatGPT, un mécanisme permet de générer des réponses qui donnent l'impression d'une véritable conversation. C'est le LLM : Large Language Model. Il s'agit d'un modèle d'intelligence artificielle générative, entraîné sur une très grande quantité de textes afin d'apprendre les caractéristiques et les relations entre les mots et les phrases. Son objectif principal est de prédire, à partir du contexte fourni, quels mots sont les plus susceptibles de venir ensuite.

## Les tokens

Les LLM ne traitent pas directement des mots, mais des **tokens**. Un *embedder* (outil de transformation) décompose les mots en tokens avant le traitement. Une règle empirique utile consiste à considérer qu'un token correspond généralement à environ 4 caractères dans un texte anglais courant. Cela équivaut à environ les trois quarts d'un mot (ainsi, 100 tokens correspondent à environ 75 mots) [@openai2026tokenizer].

**Exemple de découpage :**
« Impacting the environment » se décompose en 4 tokens : « Impact / ing / the / environment »

Les concepteurs de LLM utilisent des *embedders* différents, ce qui signifie qu'un même texte peut produire un nombre de tokens variable selon le modèle.

Les tokens peuvent se diviser en deux catégories : 
- les tokens d'entrée (aussi appelés : tokens d'input, d'instruction, de l'utilisateur ou envoyés)
- les tokens de sortie (aussi appelés : tokens d'output, générés, de l'assistant ou reçus).

### Plus l'IA doit traiter de tokens, plus elle consomme d'énergie

Le nombre de tokens de sortie est théoriquement proportionnel à la consommation d'énergie totale. 

**Exemple :** Un échange qui nécessite de traiter **10 tokens** demandera **deux fois moins d'énergie** qu'une requête qui traite **20 tokens**.

### Les tokens de sortie consomment généralement plus d'énergie que les tokens d'entrée

Certaines études montrent que le traitement d'un échange avec un long message envoyé (par exemple, 50 000 tokens) ne consomme que très légèrement plus d'énergie que de courts messages envoyés [@Caravaca2026]. Cela laisse supposer que la consommation d'un token d'entrée est négligeable par rapport à un token de sortie.
En réalité, la consommation d'un token d'entrée et d'un token de sortie varie fortement en fonction de la longueur totale de l'échange. Elle peut être plus faible lorsque la réponse du chatbot est longue, mais plus importante lorsqu'elle est courte [@vartziotis2026tokenswatthoursanalyticalenergy; @373c7a76c4004545bb3bb80df83f2932].

**Modèle simplifié** :
Une requête avec **1000 tokens en entrée** et **50 tokens en sortie** consommera en théorie **moins d'électricité** qu'une requête avec **50 tokens en entrée** et **1000 tokens en sortie**.

En supposant que la plupart des échanges avec un chatbot sont longs, on ne peut pas considérer que la consommation d'un token d'entrée est négligeable [@ruf2026cost]. 

**Règle générale** : Moins une requête traite de tokens en sortie, moins elle consommera d'énergie. C'est pareil pour les tokens en entrée, mais en général de manière moins prononcée que pour les tokens de sortie.

### Les tokens de raisonnement s'ajoutent aux tokens de sortie

Un modèle de raisonnement produit d'abord un texte de planification sur lequel il s'appuie pour élaborer sa réponse finale.
Les tokens générés par le modèle de raisonnement sont parfois **non visibles** pour l'utilisateur. Un token de raisonnement consommant **autant d'énergie** qu'un token de sortie. Ils augmentent le **nombre total de tokens traités** par le LLM, et donc sa consommation énergétique [@felipe2026reasoning].


Ainsi, nous comprenons que le nombre de tokens traités, en particulier les tokens de sortie, a un fort impact sur l'impact environnemental.
Pour mesurer cet impact et quantifier son empreinte énergétique, carbone et hydrique, trois indicateurs clés peuvent être suivis :

- les émissions de GES, exprimées en masse de dioxyde de carbone équivalent (gCO₂e) ;
- la consommation d'énergie, exprimée en watt-heures (Wh) ;
- la consommation d'eau, exprimée en volume (L ou m³).

Ces indicateurs s'appliquent aussi bien pour les tokens d'entrée que pour les tokens de sortie.

## Le rôle majeur du centre de données

Une IA générative, comme un LLM (*Large Language Model*), est un programme exécuté sur un ordinateur. Cela peut être votre machine personnelle, mais cela se fait généralement dans des centres de données (data centers). Son fonctionnement nécessite de l'énergie, ce qui engendre un impact environnemental, mesuré ici en **gCO₂e/kWh**.

Les différents services permettant d'utiliser un LLM, et consommant de l'énergie, sont les suivants :

- **Hébergement dans un data center public** (Microsoft Azure, Amazon Web Services, Google Cloud Platform) : l'IA est exécutée sur des serveurs dans un data center appartenant à une entreprise (cloud) plutôt que directement sur votre ordinateur. Ces serveurs sont très puissants et permettent d'exécuter des modèles d'IA que vous avez téléchargés ou que vous avez développés et entraînés vous-même. Dans ce cas, vous possédez l'IA et choisissez le fournisseur de cloud et la région géographique dans lesquels il sera exécuté.
- **Hébergement dans votre propre data center** : généralement réservé aux entreprises, le principe de fonctionnement est similaire au cloud public : vous détenez l'IA et décidez de la localisation de la machine sur laquelle la faire tourner.
- **Dans les data centers des fournisseurs d'IA** officiels comme OpenAI, Anthropic (Claude), Google, Mistral AI, Meta, Deepseek, Z.ai, Moonshot AI ou d'agrégateurs comme OpenRouter, Vercel, Groq et MammouthAI. Ici, vous ne contrôlez rien sur le fonctionnement de l'IA. Elle peut être hébergé dans un data center privé, ou chez un fournisseur de cloud public (au nom du fournisseur ou de l'aggrégateur).
- **Sur votre ordinateur** : certainses IA récentes et petites peuvent fonctionner directement sur votre ordinateur, tout en fournissant des performances compétitives avec les grands modèles propriétaires [@saadfalcon2026intelligencewattmeasuringintelligence]. Vous maîtrisez alors 100 % de la consommation énergétique liée à son utilisation et pouvez utiliser l'IA générative hors connexion.

### Le coût de la production d'électricité par pays

Chaque pays produit de l'électricité avec un impact environnemental variable. Pour générer **1 kWh**, une centrale émet des GES et consomme de l'eau. 

Certains organismes fournissent les facteurs d'émission de carbone de chaque pays (g de CO2e/kWh) :
- l'**International Energy Agency** (IEA), normalement payant mais accessible gratuitement sur demande, 
- l'**ADEME**, gratuit mais reprend les données de l'IEA de 2011 [@ademe2026],
- Ember Energy, gratuit et reprend des données de 2025 de l'IEA, Eurostat, BP et UN [@ember_yearly_electricity_data] 
- Spectrum IEEE, gratuit et par pays ou type de production [@jones2008water].

D'après Ember Energy, ces facteurs peuvent aller d'un peu plus de 20 (Island) à plus de 800 gCO2e / kWh (Mongolie) La **localisation des serveurs** joue un rôle principal dans l'impact environnemental de l'IA.

### Les data centers doivent être refroidits

Lors de l'utilisation des serveurs, l'électricité reçue est convertie en chaleur.
Pour maintenir leur bon fonctionnement, les serveurs d'un data center doivent être maintenus à une température optimale.
Afin d'évacuer la chaleur, les data centers utilisent différentes méthodes de refroidissement [@le_goff2023], notamment :

- **Le refroidissement direct par air extérieur** :
Possible dans les régions au climat frais, cette méthode ventile l'air extérieur pour refroidir les serveurs. Elle consomme de l'électricité principalement pour alimenter les ventilateurs et ne consomme pas d'eau.
- **Le refroidissement adiabatique** :
L'air chaud extérieur est ventilé et refroidi par pulvérisation de fines gouttelettes d'eau qui s'évaporent à son conctact. Cette méthode consomme à la fois de l'électricité et de l'eau.
- **Le refroidissement direct des puces (*Direct Chip Cooling*)** :
De l'eau circule dans des micro-tuyaux entre les composants des serveurs pour les refroidir directement. Bien que l'eau ne soit pas consommée, elle doit être refroidie à un moment donné dans le circuit, ce qui nécessite souvent de l'énergie. De plus, cette eau peut être mobilisée par le data center pendant des périodes de forte demande (par exemple, pour la consommation humaine ou l'arrosage agricole en été), ce qui peut poser des problèmes de concurrence d'usage.


#### La consommation d'eau peut être mesurée

Le **WUE** (*Water Usage Effectiveness*) est un indicateur mesurant la quantité d'eau consommée par les data center [@green_grid2011_wue].
Cette eau dîte consommée est en réalité évaporée dans l'atmosphère. L'eau prélevée prélevée dans l'environnement et remise plus tard n'est pas prise en compte dans le calcul de cet indicateur.

**Formule :** WUE (L/kWh) = Eau consommée (L) / Énergie consommée par les serveurs (kWh)

Le WUE dépend principalement de la localisation du data center et de ses méthodes de refroidissement
Ceux se trouvant dans des régions arides ont un WUE généralement plus élevé, et réquisitionnent donc plus d'eau lors des périodes de forte chaleur.

| **WUE (L/kWh)** | **Source** | **Consommation d'eau annuelle (m³)** | **Équivalent (piscines olympiques)** |
|:----------------|:-----------------------|----------:|------:|
| 0,12  | Amazon                | Inconnu   | --    |
| 0,255 | Microsoft             | 8 170 000 | 3 268 |
| 0,29  | OVH France Roubaix    | Inconnu   | --    |
| 0,19  | Meta Texas Fort Worth | 195 000   | 78    |

Table: WUE et consommation d'eau des fournisseurs de cloud {#tab:cloud-providers-wue}

Source : Rapports environnementaux

### Indice d'efficacité énergétique : le PUE

Un même serveur consomme la même quantité d'énergie, **quelle que soit sa localisation**. 
Cependant, l'énergie pour le maintenir à une température optimale varie en fonction du climat. Ainsi, il faut plus ou moins d'énergie pour les refroidir selon sa localisation.

L'indicateur permettant de mesurer l'efficacité énergétique d'un data center, notamment pour le refroidissement et la maintenance de l'infrastructure, est le **PUE** (*Power Usage Effectiveness*) [@Malone2006]. Il représente le ratio entre :

- **la consommation totale du data center**,
- **la consommation liée uniquement à l'exécution des serveurs**.

**Formule :** PUE = Consommation totale du data center (kWh) / Consommation des serveurs du data center (kWh)

**Exemples d'interprétation :**

- **PUE = 1** : Idéal. Toute l'énergie est utilisée uniquement pour faire fonctionner les serveurs.
- **PUE > 1** : En plus de l'énergie pour faire fonctionner les serveurs, le data center en consomme également pour refroidir des serveurs.
- **PUE = 2** : Autant d'énergie est consommée pour alimenter les serveurs que pour les refroidir.
- **PUE > 2** : Très mauvais. Plus d'énergie est consommée pour refroidir les serveurs que pour les alimenter.

Le PUE moyen mondial est de 1,54 [@taylor2026], quand celui de Google est de 1,09 [@google2026pue].

Le **PUE** des data centers est un critère clé dans le choix d'un fournisseur cloud et de la région d'hébergement.

## Le choix du modèle d'IA utilisé

### La taille du modèle

On mesure la taille d'un modèle de langage par son nombre de paramètres. **Plus un modèle compte de paramètres activés pendant son exécution, plus sa consommation énergétique pour un token est élevée**. Cette consommation est directement proportionnelle au nombre de paramètres.

**Exemple :** un modèle avec 100 milliards de paramètres consomme **deux fois moins d'électricité** pour traiter un token qu'un modèle avec 200 milliards de paramètres [@mistralai2025environmental].

Cette règle ne s'applique pas nécessairement à tous les fournisseurs de modèles. En effet, chacun utilise des méthodes de conception différentes, ce qui a un impact sur la consommation énergétique des modèles [@Zschache2026]. Cependant, elle peut généralement s'appliquer à tous ceux d'une même famille : les modèles GPT-6 entre eux, les modèles Gemini 3 entre eux, etc.
Ainsi, même si cette règle n'est pas universelle pour comparer tous les modèles entre eux, elle reste un indicateur fiable pour orienter le choix d'un modèle chez un même fournisseur.

**Transparence des fournisseurs** :
Les modèles open source affichent leur nombre de paramètres. Mais celui des modèles des fournisseurs privés comme OpenAI, Anthropic ou Google n'est jamais divulgué. Il est néanmoins possible de ranger par taille les modèles d'un même fournisseur grâce à leurs appellations : *luna, lite, small, nano, mini < terra, flash, medium < sol, pro, large, plus, max*.
Certains travaux tentent de quantifier ce nombre de paramètres en se basant sur différentes méthodes innovantes, comme la comparaison du volume de connaissance stocké [@li2026incompressibleknowledgeprobesestimating].

| **Modèle** | **Vendeur** | **Params estimés** |
|:------------------|:----------|:-----|
| gpt-5.5           | OpenAI    | 5 300 000 000 000 |
| claude-fable-5    | Anthropic | 3 500 000 000 000 |
| gemini-2.5-pro    | Google    | 3 000 000 000 000 |
| grok-4            | xAI       | 2 000 000 000 000 |
| claude-sonnet-4.6 | Anthropic |   760 000 000 000 |

Table: Estimation des paramètres de modèles propriétaires avec la méthode "Incompressible Knowledge Probes" [@li2026incompressibleknowledgeprobesestimating] {#tab:proprietary-model-parameters}

Source : <https://01.me/research/ikp/#/calibration#proprietary>

Il est également possible d'estimer la taille des modèles propriétaires en comparant leur prix à celui de modèles ouverts. Cependant cette méthode est très incertaine car la diminution du prix peut signifier une optimisation plutôt qu'une diminution du nombre de paramètres [@du2026tieredsupermooreslawprice].

### Les modèles MoE n'activent que les paramètres utiles

Un modèle **MoE** (*Mixture of Experts*) est un type de modèle qui n'utilise **pas l'intégralité de ses paramètres** lors de son exécution. Cela ne le rend pas moins performant ; au contraire, il active uniquement les paramètres nécessaires à la génération de la réponse. Par exemple, un modèle MoE de 300 milliards de paramètres peut n'en activer que 30 milliards, ce qui le rend **beaucoup moins énergivore** qu'un modèle dense de 100 milliards de paramètres [@mu2026comprehensivesurveymixtureofexpertsalgorithms].
En activant un **faible nombre de paramètres**, les modèles MoE diminuent la consommation énergétique pour le traitement d'un token.

## Moteurs d'inférence

La consommation énergétique d'un LLM pendant l'exécution n'est pas uniquement déterminée par le modèle lui-même : elle dépend également du moteur d'inférence utilisé [@niu2025inferenceengine].
Un moteur d'inférence, c'est en quelque sorte le logiciel qui fait fonctionner un LLM au moment où on lui pose une question.
Si le LLM était un moteur de voiture, le moteur d'inférence serait le système qui organise et contrôle son fonctionnement.
Certains fournisseurs optimisent leurs modèles pour certains moteurs d'inférence [@nvidia2026llminference].
