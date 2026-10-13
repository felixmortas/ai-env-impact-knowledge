# Réduire l'impact environnemental de l'IA générative en mettant en place des bonnes pratiques

Dans ce chapitre, vous allez découvrir quelles sont les bonnes pratiques à mettre en place pour rédure votre impact environnemental lié à l'IA, et pourquoi les appliquer peut même améliorer votre efficacité.

Il existe des bonnes pratiques adaptées à deux catégories de public :

- **L'utilisateur final** : Elles concernent la manière dont l'application IA est utilisée.
- **Le développeur d'IA** : Elles influencent la manière dont l'application IA fonctionne.

Dans les deux cas, ces bonnes pratiques visent à **minimiser votre empreinte écologique** tout en **optimisant vos performances**.

Certains acteurs comme l'ONU proposent également des leviers de réduction qui seront présentés dans ce chapitre [@aczel2026environmental].

## En tant qu'utilisateur d'un chatbot

### Prioriser une recherche sur un moteur de recherche

Si la réponse attendue à votre question est simple (par exemple, le nombre d'habitants d'une ville ou la famille d'une plante), privilégiez une recherche sur un moteur de recherche (Google, Ecosia, Bing, Qwant, Brave, DuckDuckGo).

Si vous avez le réflexe de formuler votre question dans votre chatbot avec des mots-clés pour gagner du temps, sachez que vous pouvez directement saisir ces mots-clés dans votre moteur de recherche. La réponse sera tout aussi rapide et accessible via plusieurs sources.
*Exemples : « Plus grande planète système solaire », « vitesse de la lumière ».*

Google estime qu'une recherche moyenne sur son moteur de recherche consomme **0,3 Wh** d'énergie et émet 0,2 gCO₂e en 2009 [@holzele2009powering], mais cette valeur n'est certainement plus valable. Une étude récente estime les nouvelles valeurs à 0,03 Wh et 0,02 gCO₂e, soit 10x moins que précédemment [@vanderbauwhede2025estimatingincreaseemissionscaused].
Pour comparer, Mistral AI estime qu'une requête adressée à leur modèle Mistral Large 2 avec 400 tokens en sortie émet 1,14 gCO₂e [@mistralai2025environmental].

**Attention** : Dans vos recherches avec Google ou d'autres moteurs, la fonctionnalité de **recherche par IA automatique (AI Overview)** est activée par défaut. Vous devez la désactiver dans les paramètres pour que cette bonne pratique soit valable et choisir vous-même quand utiliser l'IA pour vos recherches.

### Utiliser un modèle avec peu de paramètres activés

Lors de l'utilisation d'un chatbot, privilégiez **le plus petit modèle**, avec le moins de paramètres activés. Il est suffisant pour réaliser de nombreuses tâches avec précision [@chen2023frugalgptuselargelanguage, @cao2026taskspecificefficiencyanalysissmall].

La plupart des fournisseurs d'IA ne communiquent ni le nom exact du modèle utilisé, ni le nombre de paramètres qu'il contient. Cependant, pour vous guider, sachez que les modèles portant des noms comme *« flash »*, *« lite »*, *« rapide »*, *« nano »*, *« mini »*, *« quick »* ou *« small »* sont généralement ceux qui activent **le moins de paramètres par token traité**. 

**Recommandations pour choisir son modèle en fonction de la tâche à réaliser :**
- Petit : approfondir un sujet, reformuler ou résumer un texte, générer un bout de code basique, classifier, extraire du texte.
- Intermédiaire : planifier, concevoir une architecture, générer du code dans un projet, réaliser un traitement non standardisé.
- Grand : résoudre un problème complexe en mathématiques, sciences ou ingénierie, concevoir une architecture complexe, réaliser une planification complexe, analyser des dossiers volumineux avec des sources contradictoires.

Vous l'aurez compris : les grands modèles sont surdimensionnés pour beaucoup de cas d'usage.

Avec les modèles GPT-5 sur ChatGPT, vous ne pouvez pas choisir manuellement le modèle utilisé. Un premier modèle, appelé *« routeur »*, détermine automatiquement la taille du modèle qui traitera votre message.
Pour les utilisateurs gratuits, toutes les requêtes sont envoyées au plus petit modèle [@openai2026gpt56sol].

Pour inciter le routeur à vous addresser votre message à un modèle en particulier, vous pouvez inclure des mots-clés comme :
*« Réponds simplement »* ou *« Sans raisonner »* pour utiliser un petit modèle.
*« Réfléchis étape par étape »* ou *« Raisonne avant de répondre »* pour utiliser un modèle plus puissant ou un raisonnement [@anthropic2025prompt].

### Réduire l'effort de réflexion

Il est recommandé d'**utiliser la fonctionnalité de raisonnement** uniquement lorsque la réponse à votre requête nécessite une analyse complexe, non triviale, et doit être décomposée en plusieurs étapes pour garantir la meilleure qualité possible. Vous pouvez choisir d'activer ou non le raisonnement sur les chatbot de Google, Deepseek et Mistral.

Certains modèles, comme GPT ou Claude, permettent de paramétrer différents niveaux d'effort. Ce paramètre détermine le nombre de tokens de raisonnement et de sortie qu'il génère. Si l'on considère souvent qu'un raisonnement plus long conduit à de meilleurs résultats, ce n'est pas toujours le cas. Les performances tendent d'abord à s'améliorer à mesure que l'effort augmente, avant d'atteindre un point optimal puis, dans certains cas, de diminuer au-delà de ce seuil [@wu2025lessunderstandingchainofthoughtlength].
Il est ainsi préférable de privilégier un niveau d’effort faible à modéré.

### Prompt engineering

Cette section explique l'importance du *prompt/context engineering* : **comment fournir un contexte utile au chatbot tout en éliminant le bruit** (c'est-à-dire les informations inutiles) pour qu'il accomplisse sa tâche avec précision et génère une réponse au format souhaité.

D'après les principaux fournisseurs de modèle dont OpenAI [@openai_prompt_engineering], la structure optimale d'un prompt repose sur plusieurs éléments clés, notamment :

1. **Contexte** : La partie souvent la plus longue, qui peut être **fortement réduite** pour minimiser le nombre de tokens en entrée et clarifier la demande.
2. **Tâche** : Généralement formulée en une phrase.
3. **Livrable** : Court, mais essentiel pour **limiter le nombre de tokens en sortie**.

#### Optimiser le contexte pour réduire les tokens en entrée

Nous avons vu précédemment que les tokens en entrée ont également une influence sur la consommation énergétique de la requête [@ruf2026cost]. Il est donc recommandé de limiter le contexte pour réduire l'impact environnemental, mais aussi pour améliorer la qualité de la réponse.

#### Optimiser le livrable pour réduire les tokens en sortie

Nous avons vu précédemment que **l'impact énergétique des tokens générés en sortie est plus important que celui des tokens en entrée** [@Caravaca2026]. Il est donc généralement plus efficace, sur le plan énergétique, d'**allonger le prompt envoyé** pour tenter de réduire la longueur de la réponse.

Dans la plupart des cas, **une réponse courte et concise suffit** et évite de se perdre dans des explications inutiles.

**Exemples d'instructions pour limiter la longueur de la réponse :**
- Pour corriger des fautes d'orthographe dans un long texte :
  *« Indique uniquement les corrections à apporter, sans explications et sans recopier l'intégralité du texte. »*
- Pour corriger du code :
  *« Réécris uniquement les parties à modifier sans reproduire l’intégralité du code. Ne fournit pas d’explications. »*
- Pour reformuler un paragraphe dans un texte :
  *« Réécris uniquement le paragraphe à modifier, sans recopier le reste du texte. »*

À vous de déterminer ce dont vous avez besoin pour obtenir **la réponse attendue, et rien de plus si ce n'est pas nécessaire**.

**Astuce** : Certains chatbots, comme Claude, proposent de sélectionner le type de réponse. Privilégiez les options *« courtes »* ou *« concises »*.

Au contraire, l'utilisation de certains verbes d'action comme « justifie », « explique », « analyse » ou « recommande » a tendance à augmenter la quantité de texte généré [@adamska2026greenpromptingcharacterizingpromptdriven].

### Arrêter la génération

Si dès le début de la réponse du chatbot, vous constatez qu'elle ne correspond **absolument pas** à ce que vous attendez, **interrompez-la immédiatement** en cliquant sur le bouton *« Stop »* (généralement représenté par un carré rempli ⏹️).

Cette action simple permet de **réduire le nombre de tokens générés en sortie** en évitant une réponse inutile.

### Modifier la demande initiale plutôt que d'envoyer un nouveau message

Lorsque la réponse générée est **incomplète, interrompue ou insatisfaisante** (un élément oublié dans le contexte, un détail imprécis, une partie à supprimer), **préférez modifier le message initial** plutôt que d'en envoyer un nouveau pour affiner votre demande.

À chaque nouveau message envoyé, **tout l'historique de la conversation est réenvoyé** au modèle. Cela augmente considérablement le nombre de **tokens en entrée**, et donc l'impact environnemental.
De plus, un historique trop long introduit du **bruit** (informations inutiles), réduisant la qualité des réponses. **Plus les tokens en entrée sont limités et pertinents, meilleure sera la réponse du chatbot**.

**Exemple concret** :
Si la réponse du chatbot ne prend pas en compte un élément important, **n'envoyez pas de nouveau message** en lui demandant de recommencer sa réponse en prenant en compte un paramètre supplémentaire.
**Privilégiez la modification du message initial** pour y intégrer cette précision. Ainsi, la réponse sera regénérée avec un contexte plus complet, **sans alourdir l'historique**.

**Cas particulier : les petites corrections**
Si la réponse est **longue et ne nécessite qu'une petite modification** :

- **Ne modifiez pas le prompt initial** : cela regénérerait une réponse complète et aurait un plus gros impact liée aux tokens en *sortie*.
- **Demandez au chatbot de corriger uniquement la partie concernée** sans tout réécrire.
  *Exemple :* *« Corrige uniquement le troisième paragraphe, sans recopier le reste du texte. »*

Cette bonne pratique demande de trouver le **meilleur compromis** entre :

- **Regénérer une réponse** en modifiant le message initial, permettant de maintenir un contexte concis, mais pouvant générer plus de **tokens en sortie** ;
- **Ajouter un message**, permettant de réduire les **tokens en sortie**, mais augmentant la quantité de **tokens en entrée** à chaque nouveau message.

### Conversations engineering : créer des branches

Pour maintenir un contexte **minimal et utile**, une technique efficace consiste à **créer des branches dans une conversation**.
Toutes les informations échangées avec le chatbot ne sont pas nécessairement utiles pour répondre à une nouvelle demande.

Si vous demandez au chatbot d'apporter une précision sur sa réponse, mais que votre prochain message **ne nécessite pas cette précision**, il est préférable de **modifier la question initiale** plutôt que de l'ajouter à la conversation. Vous pouvez ainsi créer des **branches distinctes pour chaque sujet** tout en limitant le contexte au strict nécessaire.

**Exemple concret :**

1. Vous posez une question à un chatbot sur un sujet précis.
2. Il répond en abordant plusieurs points, dont certains ne sont pas clairs pour vous.
3. Vous lui demandez d'approfondir le **point 1**.
4. Pour ensuite approfondir le **point 2**, vous **modifiez le prompt initial** afin de lui demander directement des explications sur ce point, plutôt que de poser une nouvelle question dans la conversation.
5. Enfin, si vous souhaitez passer à l'action à partir de la réponse initiale, demandez-lui de **planifier le projet en modifiant le prompt consacré au point 2**, plutôt que d'envoyer une nouvelle question.

À ce stade, votre conversation compte **3 branches** :

- La **première** : votre question initiale sur le sujet, et un approfondissement sur le **point 1** que vous n'aviez pas compris.
- La **seconde** : votre question initiale sur le sujet, et un approfondissement sur le **point 2** que vous n'aviez pas compris.
- La **troisième** : votre question initiale sur le sujet, et la demande de planification.

Chaque branche traite donc d'un **aspect spécifique du projet**, permettant :

- De conserver une **seule conversation** pour l'ensemble du projet.
- D'éviter que le contexte ne soit **pollué par des informations inutiles**.
- D'**économiser le nombre de tokens** envoyés au modèle.
- De créer une **méthode de prompting hiérarchisée et spécialisée**.

![Exemple d'arborescence des branches d'une conversation avec un chatbot.](images/conv-branching-diagram.png){width=80%}

### Créer une nouvelle conversation pour chaque nouveau sujet

Nous avons constaté que chaque nouveau message envoyé, entraîne le **renvoi de l'intégralité de l'historique** de la conversation au chatbot. Il est donc préférable de **démarrer une nouvelle conversation** lorsqu'on souhaite aborder un sujet sans rapport avec le précédent [@Ruf_2025].

Deux options s'offrent à vous :

1. **Créer une nouvelle conversation** dédiée au nouveau sujet.
2. **Modifier le premier message** de la conversation existante pour y introduire le nouveau sujet.

En choisissant la deuxième option, vous **réduisez le nombre de conversations** dans votre historique, ce qui permet de maintenir un **environnement propre et organisé**.

Vous pouvez également **réutiliser la réponse d'un chatbot** en l'injectant dans une **nouvelle conversation** dédiée à une autre tâche, plutôt que de poursuivre dans la discussion initiale.
Cette approche permet encore une fois **de limiter la taille du contexte**.

### Supprimer les conversations inutiles

Lorsque vous envoyez un message à un chatbot, avant même l'historique de vos messages, plusieurs éléments sont inclus : le *prompt* du développeur, le *prompt* système, des informations contextuelles (pays, heure, langue, navigateur, etc.), ainsi qu'un **résumé de chacune de vos conversations sauvegardées** [@mane2026context]. Ces résumés ajoutent du contexte pas toujours utile pour le chatbot. **Supprimer vos anciennes conversations** lorsqu'elles ne vous sont plus utiles.

### Vider la mémoire à long terme

Lorsque vous demandez à un chatbot de retenir une information au cours d'une conversation, celle-ci sera systématiquement incluse dans les nouvelles discussions. C'est ce qu'on appelle la **mémoire à long terme** [@openai2024memoire]. Pour l'optimiser, utilisez le menu dédié s'il existe, sinon créez une conversation dédiée dans laquelle vous demandez au chatbot de **lister les informations qu'il a mémorisées**, puis supprimez celles qui ne sont plus pertinentes.

## En tant qu'entreprise développant un agent

### Prioriser les algorithmes et l'IA classique à l'IA générative

Lorsque cela suffit, privilégiez l'utilisation de technologies moins complexes.
Dans de nombreux cas, de simples algorithmes de décision ou des IA de prédiction ou classification classiques suffisent.

### Utiliser des petits modèles spécialisés.

Nous avons vu plus tôt que le nombre de paramètres activés d'un modèle a une influence importante sur l'impact environnemental du traitement d'un token.

Priorisez l'utilisation de modèles petits et spécialisés. Cela permet même parfois d'obtenir des résultats d'une meilleure précision qu'avec des grands modèles généralistes [@cao2026taskspecificefficiencyanalysissmall, @li2024smalllanguagemodelsapplication]
Des modèles déjà spécialisés sur une tâche à l'aide du fine-tuning sont mis à disposition sur Hugging Face. Privilégiez-les plutôt que de procéder à un nouveau fine-tuning.

### Prompt engineering pour réduire le nombre de tokens en sortie

De la même manière que l'utilisateur peut limiter les tokens en sortie, le développeur peut préciser explicitement la forme attendue de la réponse dans le *prompt système*. Celui-ci est pris en compte par le modèle avant même la première requête de l'utilisateur et permet de systématiquement réduire le nombre de tokens en sortie.

### Context engineering pour réduire le nombre de tokens en entrée

De nombreuses techniques existent pour **limiter le contexte** en ne conservant que les informations utiles.

**Exemples :**
- Après une conversation de 10 messages, un petit modèle peut être sollicité pour **résumer les échanges**. Ce résumé peut remplacer l'historique lors des prochains échanges.
- **Lors d'un processus multi-étapes**, les étapes peuvent êtres **décomposées** afin de ne fournir au modèle **que les informations strictement nécessaires** à chaque étape.

Vous pouvez concevoir de nombreuses autres méthodes pour **limiter le contexte envoyé au modèle**.

### Fine-tuning vs Few-shots-exemples

Pour qu'un modèle produise une sortie qui correspond aux attentes, il est possible d'ajouter d'exemples ou réaliser du *fine-tuning*.
Si l'agent ne sera pas utilisé de manière intensive*, il est recommandé d'*ajouter des exemples au contexte** (*one-shot* ou *few-shots*). En revanche, pour une utilisation massive, il est préférable de réduire le nombre de tokens en entrée en passant par le *fine-tuning*. Il permet au modèle de comprendre le type de réponse attendu **sans avoir besoin de lui fournir des exemples à chaque requête**. Cependant, le *fine-tuning* a un **coût environnemental et financier élevé**.

**Choisir entre le *few-shots* et le *fine-tuning***
Pour déterminer le seuil à partir duquel le *fine-tuning* devient plus rentable, vous pouvez :
1. Convertir en tokens les instructions pour la tâche et le *few-shots*.
2. Estimer le coût par requête en fonction de ce nombre de tokens.
3. Comparer le coût cumulé de toutes les requêtes **avec** *few-shots* au coût de toutes celles **sans** *few-shots* additionné au coût fixe du *fine-tuning*.

Lorsque le coût total des requêtes **sans** *few-shots* additionné au *fine-tuning* est inférieur à celui des requêtes **avec** *few-shots*, optez pour le *fine-tuning*.

### Hébergér le modèle dans un data center à faible impact énergétique et hydrique

Lorsque vous décidez d'héberger vous même votre modèle chez un fournisseur de cloud public, vous pouvez sélectionner une région dotée d'un **bon score énergétique et hydrique** : facteur d'émission bas, PUE et WUE faible toute l'année. 

#### Point de vue des émissions carbone
En vous référant aux données fournies par Ember Energy, présélectionnez un pays à faible facteur d'émission comme l'Islande, la Norvège, la Suisse ou la France.

Les principaux fournisseurs de cloud indiquent la localisation de leurs data centers par région :
- Amazon Web Service : [https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/](https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/)
- Microsoft Azure : [https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all](https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all)
- Google Cloud Platform : [https://datacenters.google/locations/](https://datacenters.google/locations/)
- Salesforce : [https://help.salesforce.com/s/articleView?id=000396845&type=1](https://help.salesforce.com/s/articleView?id=000396845&type=1)
- OVH : [https://www.ovhcloud.com/en/datacenter/](https://www.ovhcloud.com/en/datacenter/)

Une fois la région présélectionnée, prenez en compte le PUE du fournisseur.
Vous pouvez retrouver ces valeurs par région pour les principaux fournisseurs de cloud :

- **Amazon Web Services** : [https://sustainability.aboutamazon.com/products-services/aws-cloud](https://sustainability.aboutamazon.com/products-services/aws-cloud)
- **Microsoft Azure** : [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/)
- **Google Cloud Platform** : [https://datacenters.google/efficiency/](https://datacenters.google/efficiency/)
- **OVH** : [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf)

#### Point de vue de la consommation d'eau
Vérifiez que la région préselectionnée n'est pas à risque de sécheresse.
Pour évaluer les risques liés à la disponibilité de l'eau, le **World Resources Institute (WRI)** propose une carte des régions à fort risque de sécheresse : [https://www.wri.org/aqueduct/tools](https://www.wri.org/aqueduct/tools).

Enfin, regardez le WUE. Lorsque cet indicateur est manquant, considérez le WUE de la région d'un autre fournisseur :

- **Amazon Web Services** : [https://sustainability.aboutamazon.com/products-services/aws-cloud/](https://sustainability.aboutamazon.com/products-services/aws-cloud/)
- **Microsoft Azure** : [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/)
- **Google Cloud Platform** : lien [https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf](https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf)
- **OVH** : [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf)

### Moteur d'inférence

Certains fournisseurs optimisent leurs modèles pour des moteurs d'inférence spécifiques [@nvidia2026llminference]. Le moteur adéquat peut être indiqué dans la carte de présentation du modèle.

### Utiliser le cache

La fonctionnalité de **cache** permet de stocker et de réutiliser les calculs d'attention ainsi que les tokens d'un prompt déjà traité, évitant ainsi de tout recalculer à chaque requête.

**Cas d'usage optimisés avec le cache** :

- **Répétition d'un contexte volumineux** : par exemple lorsque vous envoyez fréquemment la même documentation dans le contexte, ou l'historique complet d'une conversation (cas d'un chatbot).
- **Agents autonomes** : les agents effectuant des appels successifs en s'appuyant sur le même **prompt système** (instructions de base, outils disponibles, exemples de guidage) et un état partagé.
- **Assistants de code** : analyse d'un dépôt de code volumineux et identique à chaque message.

Pour qu'un cache soit efficace, les requêtes doivent être peu espacées dans le temps et le préfixe du prompt (la partie à mettre en cache) doit être **strictement identique** d'une requête à l'autre. Le moindre espace ou caractère modifié au début du texte invalidera tout ou partie du cache existant.

### Traitement par lots (Batch processing)

Le **batch processing** consiste à envoyer un grand nombre de requêtes à traiter simultanément. Cette méthode optimise l'inférence du modèle et permet de **réduire significativement** le coût énergétique et financier [@poddar2025sustainablenlpinsightsbenchmarking].

Les fournisseurs de modèle via API proposent généralement le *batch processing* à **moitié prix** par rapport au traitement classique. Bien qu'il n'existe pas de données précises dans la littérature quantifiant cette réduction, on peut supposer que la variation du prix est corrélée à celle de l'impact énergétique.

Envoyez périodiquement toutes les requêtes **en batch** si vous n'avez pas besoin des réponses du modèle en **temps réel**, que le **volume de requête est important** et qu'elles sont **indépendantes** les unes des autres.

### Modèles récents

**Restez informés** sur les nouveaux modèles car certains peuvent offrir des performances équivalentes à celles de votre modèle actuel **tout en ayant un impact plus faible**, grâce à une optimisation ou une innovation.

![Principaux LLM classés selon leurs capacités, en fonction du nombre de paramètres utilisés pour leur entraînement](images/Major-Large-Language-Models.png){width=80%}

*Global landscape of LLMs and their performance. Reprinted under open access from David et al. [@david2025llm]*

Pour la génération d'images par exemple, une étude suggère que les choix du type de modèle devraient tenir compte de la longueur prévue de la sortie : les modèles autorégressifs (les plus utilisés) restent préférables pour les réponses courtes (moins de 1024 tokens), tandis que les modèles de diffusion offrent des avantages indéniables pour les tâches de génération plus longues [@ruf2026diffusion].

Attention, changer de modèle peut induire une nouvelle phase de développement (évaluation, fine-tuning) impliquant un impact environnemental significatif.
De plus, optimiser une technologie a plutôt tendance à augmenter son impact au global car elle devient peu coûteuse et est donc beaucoup plus utilisée. C'est l'effet rebond [@jevons1865coal].

#### « La quantization » : Réduire la précision des calculs réduit les besoins en énergie

« Quantizer » un modèle consiste à réduire la précision de ses calculs. On passe de nombres flotants à des nombres entiers. En réduisant la précision des calculs, on peut, dans certaines conditions, réduire la quantité d'énergie consommée par le modèle [@delavande2026understandingefficiencyquantizationbatching; @poddar2025sustainablenlpinsightsbenchmarking].
Bien sûr, cette réduction de décimales entraîne une perte de précision dans les calculs. Mais aujourd'hui, il est possible d'utiliser des modèles « quantizés » tout en conservant de très bonnes performances.

#### La distillation : quand l'élève dépasse le maître

Une technique permettant de réduire la taille des modèles et, par conséquent leur impact à l'exécution, est la distillation des connaissances.
C'est cette technique qui a été utilisée pour créer DeepSeek avec une fraction du coût énergétique de ChatGPT [@young2025deepseek].
Elle consiste à utiliser un modèle professeur, de très grande taille, pour générer des données qui serviront ensuite à affiner l'entraînement d'un autre modèle, appelé modèle élève, beaucoup plus petit. Le modèle élève peut ainsi acquérir des connaissances similaires à celles de son professeur, tout en nécessitant beaucoup moins de ressources pour son exécution [@jiao-etal-2020-tinybert].

#### Les modèles élagués (Pruning)

L'élagage (*pruning*) consiste à supprimer des paramètres du modèle. Cette technique permet de réduire fortement la taille, et donc le coût d'exécution tout en conservant de bonnes performances [@ICLR2024_160adf2d]. 
