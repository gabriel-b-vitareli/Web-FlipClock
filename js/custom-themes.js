/**
 * SISTEMA DE TEMAS PERSONALIZADOS DO USUÁRIO
 * ─────────────────────────────────────────────────────────────
 * Gerencia a criação, leitura e deleção de temas customizados no localStorage.
 * Integra com window.THEMES.
 * ─────────────────────────────────────────────────────────────
 */

(function() {
  const STORAGE_CUSTOM_THEMES_KEY = 'flipclock-custom-themes';

  function getCustomThemes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_CUSTOM_THEMES_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  function saveCustomThemes(themes) {
    localStorage.setItem(STORAGE_CUSTOM_THEMES_KEY, JSON.stringify(themes));
  }

  window.CustomThemesEngine = {
    // Carrega e junta temas padrões com temas personalizados do usuário
    loadThemes(defaultThemes) {
      const customThemes = getCustomThemes();
      
      // Filtra de window.THEMES qualquer tema que já seja custom para não duplicar no reload
      const baseThemes = defaultThemes.filter(t => !t.isCustom);
      
      // Adiciona flag isCustom nos customizados
      customThemes.forEach(t => t.isCustom = true);
      
      window.THEMES = [...baseThemes, ...customThemes];
      return window.THEMES;
    },

    saveTheme(name, vars) {
      const customThemes = getCustomThemes();
      const id = 'custom-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Verifica se id já existe nos padrões ou nos customizados
      const exists = window.THEMES.some(t => t.id === id && !t.isCustom);
      if (exists) {
        throw new Error('Não é possível substituir um tema nativo do sistema.');
      }

      const newTheme = {
        id,
        name,
        preview: [vars['--bg'], vars['--card'], vars['--text']],
        vars,
        isCustom: true
      };

      // Se já existir um custom com mesmo id, atualiza; senão, adiciona
      const idx = customThemes.findIndex(t => t.id === id);
      if (idx !== -1) {
        customThemes[idx] = newTheme;
      } else {
        customThemes.push(newTheme);
      }

      saveCustomThemes(customThemes);
      
      // Recarrega todos
      this.loadThemes(window.THEMES);
      return newTheme;
    },

    deleteTheme(themeId) {
      if (!themeId.startsWith('custom-')) return false;
      
      let customThemes = getCustomThemes();
      customThemes = customThemes.filter(t => t.id !== themeId);
      saveCustomThemes(customThemes);

      // Recarrega todos
      this.loadThemes(window.THEMES);
      return true;
    }
  };
})();
