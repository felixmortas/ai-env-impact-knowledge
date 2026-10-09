---
date: 14-09-2026
model: claude-sonnet-5
effort: medium
limits: "As full reasoning is hidden, only reasoning task names are taken into account. Conversational agent is probably looping so input is processed several times, but we consider a one-shot response and omit input reprocessing. Artifacts are considered into output tokens count."
---
<input>
```
Input : 
- model_name = nom du modèle (liste depuis données + custom)
  - nb_params = paramètres du modèle (pré-rempli depuis données)
  - nb_params_activated = paramètres activés du modèle (pré-rempli depuis données)

  - provider = fournisseur (liste depuis données + custom)

- country = pays (pré-rempli en fonction du fournisseur)

- system_prompt = Prompt système (pré-rempli depuis données)
- conversation_bloc = Bloc d'un échange réutilisable à l'infini :
  - user_message = message utilisateur OU output de l'outil
  - reasoning = raisonnement (output token)
  - completion = réponse du modèle (output token)

Données :
- emission_factor = Facteur d'Emission/pays (par ordre de priorité : IEA ou Ember Energy ou ADEME)
- pue = PUE/pays/fournisseur --> extrapoler manquant par moyenne par pays des autres fournisseurs (fallback : moyenne du fournisseur)
- wue = WUE/pays/fournisseur --> extrapoler manquant par moyenne par pays des autres fournisseurs (fallback : moyenne du fournisseur)
- dry_risk = pays à risque de sécheresse/fournisseur --> https://www.wri.org/aqueduct/tools

- nb_params --> estimation avec https://01.me/research/ikp//#/calibration
- nb_params_activated --> faire regression de tous les params activés par params total pour modèles ouvert

- prompt_system --> par ordre de priorité : https://leaked-system-prompts.com/ , puis https://github.com/elder-plinius/CL4R1T4S , puis https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools/tree/main 

- nrj_input_token = nrj/token input/milliard params activé --> trouver études diff avec output OU price-based
- nrj_cache_input_token = nrj/token input cache/milliard params activé --> trouver études diff avec input sans cache OU price-based
- nrj_output_token = nrj/token output/milliar params activé --> moyenne des derniers modèles (trouver benchmark ou études)

Subtilités :
- conversion mots en tokens sur https://platform.openai.com/tokenizer ou bien 1 token = 0.7 mots (source)
- new_input() = dernier bloc d'échange calculé comme tokens input
- history() = tous les blocs d'échange précédents calculés comme tokens cache input


Output :
- nrj_request = consommation énergétique pour la requête
- co2_request = émissions de CO2e pour la requête
- water_request = consommation d'eau pour la requête
- dry_risk_request = indicateur de sécheresse du pays
```


Plus tard, je devrais transformer ce modèle mathématique en site web avec calcultateur. Mais ça sera le travail pour plus tard.
Aide moi à écrire les formules pour nrj_request, co2_request et water_request en détaillant le plus les calculs pour que je puisse donner ton output à la personne qui crééra le calculateur
</intput>

<reasoning>
Drafting formulas for energy, CO2, and water calculations.
Mapping out the underlying data model and variables.
Modeling per-request token flow across conversation history.
Deriving energy costs by token type and overhead.
Structurant la spécification complète en document markdown.
Ajoutant un exemple de code Python bien commenté.
Détaillant les étapes de calcul et le risque hydrique.
</reasoning>

<output>
Je vais te préparer une spec complète des formules, avec les hypothèses explicites à valider avec ton équipe data (certaines zones du modèle sont ambiguës — je les liste à la fin). Vu que c'est un document destiné à être transmis à quelqu'un d'autre, je le structure en fichier markdown que tu pourras partager tel quel.
</output>

<reasoning>
Check markdown skill before creating the spec document
</reasoning>

<output>
Pas de skill dédié pour le markdown ici — je pars directement sur la rédaction.

## Architecture de calcul (avant les formules)

Le pipeline se décompose en 5 étapes séquentielles, chacune consommant la sortie de la précédente :

```
Blocs de conversation
   → [1] Tokenisation (new_input / history / output)
   → [2] Énergie de calcul brute (IT energy) — pondérée par nb_params_activated
   → [3] Énergie totale datacenter (× PUE) = nrj_request
   → [4a] × emission_factor(pays)      = co2_request
   → [4b] × WUE(pays, fournisseur)     = water_request
   → [4c] lookup dry_risk(pays, fournisseur) = dry_risk_request
```

Points clés : `co2_request` et `water_request` dérivent tous les deux de `nrj_request`, pas des tokens directement — c'est important pour l'implémentation (calculer `nrj_request` une seule fois, puis le réutiliser deux fois).
</output>

<reasoning>
Spec document detailling the energy/CO2/water formulas for the LLM r...
</reasoning>

<output>
Le point le plus important à trancher avant de transmettre ce doc : les 6 hypothèses de la section 11, surtout le cache du `system_prompt` et le `cache_hit_rate` (le modèle actuel suppose un cache parfait à 100%, ce qui sous-estime probablement l'énergie réelle sur les longues conversations).
</output>

<artifact-created>
# Spécification des formules — Calculateur d'empreinte d'une requête LLM

Document de référence pour l'implémentation des sorties `nrj_request`, `co2_request`, `water_request` et `dry_risk_request`, à partir des inputs et données décrits dans le modèle initial.

---

## 0. Architecture de calcul (pipeline)

```
Blocs de conversation (system_prompt + conversation_bloc[1..N])
        │
        ▼
[1] Tokenisation ─────────► new_input(i) / history(i) / output(i)
        │
        ▼
[2] Énergie de calcul brute (IT energy) ─► pondérée par nb_params_activated
        │
        ▼
[3] Énergie totale datacenter ──────────► × PUE(pays, fournisseur) = nrj_request(i)
        │
        ├──[4a]──► × emission_factor(pays)          = co2_request(i)
        ├──[4b]──► × WUE(pays, fournisseur)          = water_request(i)
        └──[4c]──► lookup dry_risk(pays, fournisseur) = dry_risk_request(i)
```

**Principe central :** `co2_request` et `water_request` ne se calculent **pas** directement à partir des tokens — ils dérivent tous les deux de `nrj_request`. Calculer `nrj_request` une seule fois par requête, puis le réutiliser pour les deux conversions.

Le calcul se fait **par bloc `i`** (= par requête/tour de conversation). Un bloc `i` correspond à l'appel API qui envoie tout l'historique + le nouveau message utilisateur, et reçoit en retour le raisonnement + la complétion.

---

## 1. Notations et unités

| Variable | Description | Unité | Source |
|---|---|---|---|
| `P_tot` | `nb_params` — nombre total de paramètres du modèle | paramètres (unité brute) | estimation IKP |
| `P_act` | `nb_params_activated` — paramètres activés (MoE) | paramètres (unité brute) | régression (modèles ouverts) |
| `EF(pays)` | `emission_factor` | gCO2e / kWh | IEA > Ember > ADEME |
| `PUE(pays, fournisseur)` | Power Usage Effectiveness | sans unité (ratio ≥ 1) | data + extrapolation |
| `WUE(pays, fournisseur)` | Water Usage Effectiveness | L / kWh | data + extrapolation |
| `dry_risk(pays, fournisseur)` | Risque de sécheresse | catégoriel (ex. low/med/high/extreme) | WRI Aqueduct |
| `r_in` | `nrj_input_token` | Wh / token / milliard de paramètres activés | étude(s) |
| `r_cache` | `nrj_cache_input_token` | Wh / token / milliard de paramètres activés | étude(s) |
| `r_out` | `nrj_output_token` | Wh / token / milliard de paramètres activés | étude(s) |

> ⚠️ Vérifier que `r_in`, `r_cache`, `r_out` sont bien exprimés dans la **même unité d'énergie** (Wh recommandé) avant toute implémentation. Si les études sources donnent du J ou du kWh, convertir en amont dans la couche data.

---

## 2. Étape 1 — Tokenisation des blocs

### 2.1 Comptage des tokens d'un texte
Deux méthodes possibles (à choisir en fonction de la précision voulue) :
- **Tokenizer réel** (ex. `tiktoken`, tokenizer OpenAI) → exact, dépend du modèle.
- **Approximation** : `nb_tokens ≈ nb_mots / 0.7`

### 2.2 Répartition new_input / history / output

Soit `T(x)` le nombre de tokens d'un texte `x`, et `S` le `system_prompt`.

**Bloc 1 (premier échange) :**
```
new_input(1) = T(S) + T(user_message(1))
history(1)   = 0
output(1)    = T(reasoning(1)) + T(completion(1))
```

**Bloc i > 1 :**
```
new_input(i) = T(user_message(i))

history(i) = T(S) + Σ_{j=1}^{i-1} [ T(user_message(j)) + T(reasoning(j)) + T(completion(j)) ]

output(i) = T(reasoning(i)) + T(completion(i))
```

> **Hypothèse à valider** : le `system_prompt` est compté comme "nouveau" uniquement au bloc 1, puis comme "cache" à partir du bloc 2 (car il est identique à chaque appel et donc mis en cache côté fournisseur). Voir section 11.

> Si un `user_message` est en réalité un **output d'outil** (tool result), le traiter comme du texte classique côté tokenisation — pas de règle spéciale nécessaire à ce niveau.

---

## 3. Étape 2 — Énergie de calcul brute (compute energy)

Les taux `r_in`, `r_cache`, `r_out` sont normalisés **par milliard de paramètres activés**. On les pondère donc par `P_act / 1e9` :

```
nrj_compute(i) = new_input(i) × r_in    × (P_act / 1e9)
               + history(i)   × r_cache × (P_act / 1e9)
               + output(i)    × r_out   × (P_act / 1e9)
```

Résultat en **Wh** (énergie IT brute, hors overhead datacenter).

---

## 4. Étape 3 — Énergie totale de la requête : `nrj_request`

Application du PUE (électricité totale consommée par le datacenter pour produire cette énergie de calcul, refroidissement inclus) :

```
nrj_request(i) = nrj_compute(i) × PUE(pays, fournisseur)
```

**Unité de sortie : Wh** (convertir en kWh en divisant par 1000 pour les étapes suivantes si besoin).

---

## 5. Étape 4a — Émissions carbone : `co2_request`

```
co2_request(i) = (nrj_request(i) / 1000)   ×   EF(pays)
                  [kWh]                        [gCO2e/kWh]
```

**Unité de sortie : gCO2e** (diviser par 1000 pour obtenir du kgCO2e si préférence d'affichage).

> Le pays utilisé ici est le `country` associé à la requête (pré-rempli depuis le `provider`, donc le pays du datacenter — pas le pays de l'utilisateur final).

---

## 6. Étape 4b — Consommation d'eau : `water_request`

```
water_request(i) = (nrj_request(i) / 1000)   ×   WUE(pays, fournisseur)
                     [kWh]                        [L/kWh]
```

**Unité de sortie : Litres**.

> **Simplification actuelle** : on n'utilise que le WUE "on-site" du datacenter (fourni par la donnée). Un modèle plus complet ajouterait l'eau "off-site" liée à la production électrique elle-même (WUE source, dépendant du mix énergétique du pays). Voir section 11 si vous voulez affiner plus tard.

---

## 7. Étape 4c — Indicateur de risque : `dry_risk_request`

```
dry_risk_request(i) = dry_risk(pays, fournisseur)   # simple lookup, pas de calcul
```

C'est un **label catégoriel** (issu de WRI Aqueduct), pas une valeur numérique combinée à `water_request`. Il s'affiche à côté de `water_request` pour contextualiser le risque (ex. "12 L consommés — pays à risque de sécheresse ÉLEVÉ").

> Option future : proposer une variante *pondérée* du type `water_request_weighted = water_request × poids(dry_risk)` si le produit final veut un score unique. Non retenu par défaut ici, car ça mélange une mesure physique (litres) et un indicateur de risque qualitatif.

---

## 8. Agrégation sur une conversation entière (optionnel)

Le modèle de données autorise un nombre infini de `conversation_bloc`. Deux métriques sont possibles côté produit — à décider avec le développeur du site :

- **Par requête** (ce que ce document calcule) : `nrj_request(i)`, `co2_request(i)`, `water_request(i)` pour le dernier bloc ajouté.
- **Cumulé sur la conversation** :
```
nrj_total   = Σ_{i=1}^{N} nrj_request(i)
co2_total   = Σ_{i=1}^{N} co2_request(i)
water_total = Σ_{i=1}^{N} water_request(i)
```

Recommandation : afficher les deux sur le calculateur (coût du dernier tour + coût cumulé de la conversation), car `history(i)` grossit avec chaque bloc et le coût par requête augmente mécaniquement au fil de la conversation même si le fournisseur facture le cache moins cher.

---

## 9. Résumé condensé des formules

```
new_input(i), history(i), output(i)          → tokenisation (§2)

nrj_compute(i) = (P_act/1e9) × [ new_input(i)·r_in + history(i)·r_cache + output(i)·r_out ]

nrj_request(i) = nrj_compute(i) × PUE(pays, fournisseur)                    [Wh]

co2_request(i)   = (nrj_request(i)/1000) × EF(pays)                          [gCO2e]

water_request(i) = (nrj_request(i)/1000) × WUE(pays, fournisseur)            [L]

dry_risk_request(i) = dry_risk(pays, fournisseur)                            [catégoriel]
```

---

## 10. Exemple chiffré (illustratif, valeurs fictives)

| Variable | Valeur |
|---|---|
| `P_act` | 37 milliards |
| `new_input(i)` | 500 tokens |
| `history(i)` | 4 000 tokens |
| `output(i)` | 800 tokens |
| `r_in` | 0.0020 Wh/token/Md params |
| `r_cache` | 0.0004 Wh/token/Md params |
| `r_out` | 0.0060 Wh/token/Md params |
| `PUE` | 1.15 |
| `EF(pays)` | 60 gCO2e/kWh |
| `WUE(pays, fournisseur)` | 1.8 L/kWh |

```
nrj_compute = 37 × [500×0.0020 + 4000×0.0004 + 800×0.0060]
            = 37 × [1.0 + 1.6 + 4.8]
            = 37 × 7.4
            = 273.8 Wh

nrj_request = 273.8 × 1.15 = 314.9 Wh  (0.3149 kWh)

co2_request   = 0.3149 × 60  = 18.9 gCO2e
water_request = 0.3149 × 1.8 = 0.567 L
```

---

## 11. Hypothèses et points ouverts à valider avec l'équipe data

1. **Cache du system_prompt** : on suppose qu'il n'est "nouveau" qu'au bloc 1, puis toujours en cache ensuite. À confirmer — certains fournisseurs ont une durée de vie de cache limitée (ex. 5–10 min), ce qui invaliderait cette hypothèse pour des conversations lentes.
2. **Raisonnement vs complétion** : le modèle de données ne définit qu'un seul taux `nrj_output_token`. On suppose que `reasoning` et `completion` ont le même coût énergétique par token. Si des données distinctes existent (le raisonnement peut être plus/moins coûteux selon les architectures), prévoir deux taux séparés.
3. **`nb_params_activated` pour les modèles fermés** : la régression n'est mentionnée que pour les modèles ouverts. Pour les modèles propriétaires (GPT, Claude, Gemini...), il faut définir une méthode de fallback (ex. supposer un modèle dense `P_act = P_tot`, ou une estimation par analogie architecturale).
4. **Taux de succès du cache réel** : le modèle suppose 100% de cache hit sur l'historique. En pratique certains appels API n'activent pas le cache (première requête après expiration, changement de paramètres, etc.). Un paramètre `cache_hit_rate` (0–1) pourrait affiner le calcul : `history_effective = history(i) × cache_hit_rate + history(i) × (1-cache_hit_rate) × (r_in/r_cache)`.
5. **WUE on-site uniquement** : pas de prise en compte de l'eau utilisée pour produire l'électricité elle-même (WUE source, lié au mix énergétique du pays). À ajouter en V2 si les données sont disponibles.
6. **Unités des taux `r_in`/`r_cache`/`r_out`** : à harmoniser en Wh avant implémentation — vérifier l'unité de chaque étude source.

---

## 12. Implémentation de référence (Python)

```python
from dataclasses import dataclass


@dataclass
class ModelConfig:
    """Static configuration for a given model + provider + country."""
    params_activated_billions: float  # P_act, in billions of parameters
    pue: float                        # datacenter Power Usage Effectiveness
    emission_factor_g_per_kwh: float  # gCO2e per kWh
    wue_l_per_kwh: float              # liters per kWh
    dry_risk: str                     # categorical label, e.g. "high"


@dataclass
class TokenRates:
    """Energy rates per token, per billion activated parameters (Wh)."""
    input_rate: float       # r_in
    cache_input_rate: float # r_cache
    output_rate: float      # r_out


@dataclass
class RequestResult:
    nrj_wh: float
    co2_g: float
    water_l: float
    dry_risk: str


def compute_request_footprint(
    new_input_tokens: int,
    history_tokens: int,
    output_tokens: int,
    model: ModelConfig,
    rates: TokenRates,
) -> RequestResult:
    """
    Compute the energy, CO2 and water footprint of a single LLM request (one
    conversation bloc), following the pipeline:
      tokens -> compute energy -> +PUE -> nrj_request -> co2/water/dry_risk
    """
    # Step 1: raw compute energy, scaled by activated params (per billion)
    nrj_compute_wh = model.params_activated_billions * (
        new_input_tokens * rates.input_rate
        + history_tokens * rates.cache_input_rate
        + output_tokens * rates.output_rate
    )

    # Step 2: total datacenter energy, including cooling/overhead (PUE)
    nrj_request_wh = nrj_compute_wh * model.pue

    # Step 3: derive CO2 and water from nrj_request (convert Wh -> kWh)
    nrj_request_kwh = nrj_request_wh / 1000
    co2_request_g = nrj_request_kwh * model.emission_factor_g_per_kwh
    water_request_l = nrj_request_kwh * model.wue_l_per_kwh

    # Step 4: dry risk is a plain lookup, not derived from energy
    return RequestResult(
        nrj_wh=nrj_request_wh,
        co2_g=co2_request_g,
        water_l=water_request_l,
        dry_risk=model.dry_risk,
    )


def compute_conversation_footprint(
    blocs: list[dict],  # each: {"user_message": str, "reasoning": str, "completion": str}
    system_prompt: str,
    model: ModelConfig,
    rates: TokenRates,
    count_tokens,  # callable: str -> int (real tokenizer or word-based estimate)
) -> list[RequestResult]:
    """
    Walk through all conversation blocs and compute the per-request footprint
    for each one, applying the new_input / history / output split described
    in the spec (system prompt counted as new input only on the first bloc).
    """
    results: list[RequestResult] = []
    history_tokens = 0

    for i, bloc in enumerate(blocs):
        user_tokens = count_tokens(bloc["user_message"])
        reasoning_tokens = count_tokens(bloc.get("reasoning", ""))
        completion_tokens = count_tokens(bloc.get("completion", ""))

        if i == 0:
            # First request: system prompt is "new", no history yet
            new_input_tokens = count_tokens(system_prompt) + user_tokens
        else:
            # Subsequent requests: only the new user message is "new";
            # everything before it (system prompt + prior blocs) is cached
            new_input_tokens = user_tokens

        output_tokens = reasoning_tokens + completion_tokens

        result = compute_request_footprint(
            new_input_tokens=new_input_tokens,
            history_tokens=history_tokens,
            output_tokens=output_tokens,
            model=model,
            rates=rates,
        )
        results.append(result)

        # Update running history for the NEXT bloc: everything exchanged so far
        history_tokens += user_tokens + reasoning_tokens + completion_tokens
        if i == 0:
            history_tokens += count_tokens(system_prompt)

    return results
```

Ce squelette est volontairement simple (pas de gestion d'erreurs, pas de cache_hit_rate) — à adapter selon les décisions prises sur les points ouverts de la section 11.
</artifact-created>