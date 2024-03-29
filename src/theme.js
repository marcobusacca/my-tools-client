import { ref } from 'vue';

export const theme = ref('dark');

export const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
};