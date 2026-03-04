// Consumo médio em operação (Watts) - Não representa o pico máximo da fonte
export const listaImpressoras = [
  { id: 'custom', nome: 'Outra / Digitar Manualmente', watts: '' },
  
  // ==========================================
  // CREALITY
  // ==========================================
  { id: 'cr_ender3', nome: 'Creality Ender 3 / Pro', watts: '150' },
  { id: 'cr_ender3v2', nome: 'Creality Ender 3 V2', watts: '150' },
  { id: 'cr_ender3v2neo', nome: 'Creality Ender 3 V2 Neo', watts: '150' },
  { id: 'cr_ender3max', nome: 'Creality Ender 3 Max / Max Neo', watts: '250' },
  { id: 'cr_ender3s1', nome: 'Creality Ender 3 S1 / Pro', watts: '200' },
  { id: 'cr_ender3s1plus', nome: 'Creality Ender 3 S1 Plus', watts: '250' },
  { id: 'cr_ender3v3se', nome: 'Creality Ender 3 V3 SE', watts: '200' },
  { id: 'cr_ender3v3ke', nome: 'Creality Ender 3 V3 KE', watts: '250' },
  { id: 'cr_ender5', nome: 'Creality Ender 5 / Pro', watts: '200' },
  { id: 'cr_ender5plus', nome: 'Creality Ender 5 Plus', watts: '350' },
  { id: 'cr_ender5s1', nome: 'Creality Ender 5 S1', watts: '250' },
  { id: 'cr_cr10', nome: 'Creality CR-10 / S', watts: '200' },
  { id: 'cr_cr10v2', nome: 'Creality CR-10 V2 / V3', watts: '250' },
  { id: 'cr_cr10smart', nome: 'Creality CR-10 Smart / Pro', watts: '300' },
  { id: 'cr_cr10max', nome: 'Creality CR-10 Max', watts: '500' },
  { id: 'cr_cr6se', nome: 'Creality CR-6 SE', watts: '200' },
  { id: 'cr_cr6max', nome: 'Creality CR-6 Max', watts: '350' },
  { id: 'cr_cr30', nome: 'Creality CR-30 (PrintMill)', watts: '250' },
  { id: 'cr_k1', nome: 'Creality K1', watts: '350' },
  { id: 'cr_k1c', nome: 'Creality K1C', watts: '350' },
  { id: 'cr_k1max', nome: 'Creality K1 Max', watts: '600' },
  { id: 'cr_sermoonv1', nome: 'Creality Sermoon V1 / Pro', watts: '150' },
  { id: 'cr_sermoond1', nome: 'Creality Sermoon D1', watts: '250' },
  { id: 'cr_sermoond3', nome: 'Creality Sermoon D3', watts: '350' },
  { id: 'cr_halotone', nome: 'Creality Halot-One / Plus (Resina)', watts: '100' },
  { id: 'cr_halotmage', nome: 'Creality Halot-Mage / Pro (Resina)', watts: '150' },
  { id: 'cr_halotsky', nome: 'Creality Halot-Sky (Resina)', watts: '180' },
  { id: 'cr_ld002r', nome: 'Creality LD-002R / H (Resina)', watts: '70' },
  { id: 'cr_hicombo', nome: 'Creality Hi Combo', watts: '200' },

  // ==========================================
  // BAMBU LAB
  // ==========================================
  { id: 'bl_a1mini', nome: 'Bambu Lab A1 Mini', watts: '150' },
  { id: 'bl_a1', nome: 'Bambu Lab A1', watts: '300' },
  { id: 'bl_p1p', nome: 'Bambu Lab P1P', watts: '250' },
  { id: 'bl_p1s', nome: 'Bambu Lab P1S', watts: '300' },
  { id: 'bl_x1c', nome: 'Bambu Lab X1 Carbon', watts: '350' },
  { id: 'bl_x1e', nome: 'Bambu Lab X1E', watts: '350' },

  // ==========================================
  // ANYCUBIC
  // ==========================================
  { id: 'any_i3mega', nome: 'Anycubic i3 Mega / S', watts: '180' },
  { id: 'any_megax', nome: 'Anycubic Mega X', watts: '250' },
  { id: 'any_megazero', nome: 'Anycubic Mega Zero 2.0', watts: '150' },
  { id: 'any_vyper', nome: 'Anycubic Vyper', watts: '200' },
  { id: 'any_kobra', nome: 'Anycubic Kobra / Neo / Go', watts: '200' },
  { id: 'any_kobraplus', nome: 'Anycubic Kobra Plus', watts: '300' },
  { id: 'any_kobramax', nome: 'Anycubic Kobra Max', watts: '350' },
  { id: 'any_kobra2', nome: 'Anycubic Kobra 2 / Neo / Pro', watts: '250' },
  { id: 'any_kobra2plus', nome: 'Anycubic Kobra 2 Plus', watts: '300' },
  { id: 'any_kobra2max', nome: 'Anycubic Kobra 2 Max', watts: '400' },
  { id: 'any_photon', nome: 'Anycubic Photon / S (Resina)', watts: '40' },
  { id: 'any_photonmono', nome: 'Anycubic Photon Mono / SE (Resina)', watts: '45' },
  { id: 'any_photonmonox', nome: 'Anycubic Photon Mono X / 6K (Resina)', watts: '120' },
  { id: 'any_photonm3', nome: 'Anycubic Photon M3 (Resina)', watts: '70' },
  { id: 'any_photonm3plus', nome: 'Anycubic Photon M3 Plus (Resina)', watts: '120' },
  { id: 'any_photonm3max', nome: 'Anycubic Photon M3 Max (Resina)', watts: '150' },
  { id: 'any_photonmono2', nome: 'Anycubic Photon Mono 2 (Resina)', watts: '50' },
  { id: 'any_photonm5', nome: 'Anycubic Photon Mono M5 / M5s (Resina)', watts: '100' },

  // ==========================================
  // ELEGOO
  // ==========================================
  { id: 'el_neptune2', nome: 'Elegoo Neptune 2 / 2S', watts: '150' },
  { id: 'el_neptune3', nome: 'Elegoo Neptune 3 / Pro', watts: '200' },
  { id: 'el_neptune3plus', nome: 'Elegoo Neptune 3 Plus', watts: '300' },
  { id: 'el_neptune3max', nome: 'Elegoo Neptune 3 Max', watts: '350' },
  { id: 'el_neptune4', nome: 'Elegoo Neptune 4 / Pro', watts: '250' },
  { id: 'el_neptune4plus', nome: 'Elegoo Neptune 4 Plus', watts: '300' },
  { id: 'el_neptune4max', nome: 'Elegoo Neptune 4 Max', watts: '400' },
  { id: 'el_mars2', nome: 'Elegoo Mars 2 / Pro (Resina)', watts: '50' },
  { id: 'el_mars3', nome: 'Elegoo Mars 3 / Pro (Resina)', watts: '50' },
  { id: 'el_mars4', nome: 'Elegoo Mars 4 / Ultra / Max (Resina)', watts: '70' },
  { id: 'el_saturn', nome: 'Elegoo Saturn / S (Resina)', watts: '90' },
  { id: 'el_saturn2', nome: 'Elegoo Saturn 2 (Resina)', watts: '100' },
  { id: 'el_saturn3', nome: 'Elegoo Saturn 3 / Ultra (Resina)', watts: '120' },
  { id: 'el_jupiter', nome: 'Elegoo Jupiter / SE (Resina)', watts: '200' },

  // ==========================================
  // PRUSA RESEARCH
  // ==========================================
  { id: 'pr_mini', nome: 'Prusa MINI / MINI+', watts: '80' },
  { id: 'pr_mk3s', nome: 'Prusa i3 MK3S / MK3S+', watts: '120' },
  { id: 'pr_mk4', nome: 'Prusa MK4', watts: '150' },
  { id: 'pr_xl1', nome: 'Prusa XL (1 Cabeçote)', watts: '250' },
  { id: 'pr_xl2', nome: 'Prusa XL (2 Cabeçotes)', watts: '300' },
  { id: 'pr_xl5', nome: 'Prusa XL (5 Cabeçotes)', watts: '400' },
  { id: 'pr_sl1s', nome: 'Prusa SL1S Speed (Resina)', watts: '100' },
  { id: 'pr_cw1s', nome: 'Prusa CW1S (Cura/Lavagem)', watts: '130' },

  // ==========================================
  // ARTILLERY
  // ==========================================
  { id: 'art_hornet', nome: 'Artillery Hornet', watts: '150' },
  { id: 'art_genius', nome: 'Artillery Genius / Pro', watts: '200' },
  { id: 'art_x1', nome: 'Artillery Sidewinder X1', watts: '300' },
  { id: 'art_x2', nome: 'Artillery Sidewinder X2', watts: '300' },
  { id: 'art_x3pro', nome: 'Artillery Sidewinder X3 Pro', watts: '250' },
  { id: 'art_x3plus', nome: 'Artillery Sidewinder X3 Plus', watts: '300' },
  { id: 'art_x4pro', nome: 'Artillery Sidewinder X4 Pro', watts: '250' },
  { id: 'art_x4plus', nome: 'Artillery Sidewinder X4 Plus', watts: '300' },

  // ==========================================
  // FLASHFORGE
  // ==========================================
  { id: 'ff_finder3', nome: 'Flashforge Finder 3', watts: '100' },
  { id: 'ff_adv3', nome: 'Flashforge Adventurer 3 / Pro', watts: '150' },
  { id: 'ff_adv4', nome: 'Flashforge Adventurer 4 / Pro', watts: '300' },
  { id: 'ff_adv5m', nome: 'Flashforge Adventurer 5M / Pro', watts: '350' },
  { id: 'ff_creatorpro2', nome: 'Flashforge Creator Pro 2', watts: '300' },
  { id: 'ff_creator3', nome: 'Flashforge Creator 3 / Pro', watts: '400' },
  { id: 'ff_guider2', nome: 'Flashforge Guider II / IIS', watts: '400' },

  // ==========================================
  // PHROZEN (RESINA)
  // ==========================================
  { id: 'ph_sonicmini', nome: 'Phrozen Sonic Mini 4K / 8K / 8K S', watts: '50' },
  { id: 'ph_sonicmighty', nome: 'Phrozen Sonic Mighty 4K / 8K', watts: '120' },
  { id: 'ph_sonicmega', nome: 'Phrozen Sonic Mega 8K / 8K S', watts: '250' },

  // ==========================================
  // QIDI TECH
  // ==========================================
  { id: 'qd_imate', nome: 'Qidi Tech i-Mate / S', watts: '250' },
  { id: 'qd_xplus', nome: 'Qidi Tech X-Plus / X-Max', watts: '350' },
  { id: 'qd_xsmart3', nome: 'Qidi Tech X-Smart 3', watts: '250' },
  { id: 'qd_xplus3', nome: 'Qidi Tech X-Plus 3', watts: '400' },
  { id: 'qd_xmax3', nome: 'Qidi Tech X-Max 3', watts: '450' },

  // ==========================================
  // SOVOL
  // ==========================================
  { id: 'sv_sv01', nome: 'Sovol SV01 / Pro', watts: '200' },
  { id: 'sv_sv06', nome: 'Sovol SV06', watts: '200' },
  { id: 'sv_sv06plus', nome: 'Sovol SV06 Plus', watts: '300' },
  { id: 'sv_sv07', nome: 'Sovol SV07 / Plus', watts: '300' },

  // ==========================================
  // PROJETOS CUSTOMIZADOS (VORON / RATRIG / ETC)
  // ==========================================
  { id: 'voron_v0', nome: 'Voron V0 / V0.1 / V0.2', watts: '150' },
  { id: 'voron_trident', nome: 'Voron Trident (Média)', watts: '350' },
  { id: 'voron_24', nome: 'Voron 2.4 (300mm / 350mm)', watts: '450' },
  { id: 'ratrig_vcore', nome: 'RatRig V-Core 3 (Média)', watts: '450' },
  { id: 'ratrig_vminion', nome: 'RatRig V-Minion', watts: '150' },

  // ==========================================
  // PÓS-PROCESSAMENTO (LAVAGEM / CURA)
  // ==========================================
  { id: 'wash_cure_peq', nome: 'Estação Wash & Cure (Pequena)', watts: '40' },
  { id: 'wash_cure_gde', nome: 'Estação Wash & Cure (Plus / Max)', watts: '80' }
];