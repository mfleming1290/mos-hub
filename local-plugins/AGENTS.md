# Local MOS plugins

- Purpose: Retain local plugin staging and acceptance evidence; released plugins have separate source repositories.
- Owns: `battlemoon-clock/`; nearest parent owns other paths.
- Inputs: Pinned Battlemoon Git source and component artifacts; MOS's existing federation/settings/package contracts.
- Outputs: Local build inputs and acceptance evidence. Battlemoon Clock's public mos-battlemoon-clock repository owns its 0.1.0 release and offline component provisioning; this staging folder is not the release source.
- Invariants: Shared Clock domain remains in its package. Vue comes only from the MOS host. Installation, publishing, repository creation and NAS changes require explicit approval.
- Work guidance: Read `battlemoon-clock/README.md` before build or acceptance work. Generated adapters must be copied only from verified Git inputs, not edited.
- Verification: Plugin package scripts own focused checks; browser/federation fixtures are supporting evidence, not actual MOS acceptance.
- Routes: None.
