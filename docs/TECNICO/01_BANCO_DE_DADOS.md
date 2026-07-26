# Banco de dados

As entidades centrais são `profiles`, `stories`, `licenses`, `game_sessions`, `players`, `roles`, `acts`, `story_steps`, `game_events`, `decisions`, `votes`, `puzzles`, `hints`, `envelopes`, `inventory_items`, `messages`, `media_assets`, `score_events` e itens de reorganização.

Uma licença possui somente `code_hash` e `code_last4`. Uma restrição única parcial impede duas sessões simultâneas nos estados `lobby`, `role_assignment`, `active` e `paused`.
