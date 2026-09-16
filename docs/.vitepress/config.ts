import { defineConfig } from 'vitepress';
export default defineConfig({
  title: 'Mizani Clinic Ambassador',
  description: 'Ambassador, admin and developer documentation',
  base: '/mizaniclinic/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }, { text: 'User Guide', link: '/user-guide/' },
      { text: 'Admin Guide', link: '/admin-guide/' }, { text: 'Developer', link: '/developer/' },
      { text: 'Database Setup', link: '/developer/database' }, { text: 'API Reference', link: '/api/' },
    ],
    sidebar: [
      { text: 'Ambassadors', items: [
        { text: 'Getting Started', link: '/user-guide/' }, { text: 'Registration', link: '/user-guide/registration' },
        { text: 'Dashboard', link: '/user-guide/dashboard' },
      ] },
      { text: 'Administration', items: [{ text: 'Admin Guide', link: '/admin-guide/' }] },
      { text: 'Development', items: [
        { text: 'Developer Guide', link: '/developer/' }, { text: 'Database Setup', link: '/developer/database' },
        { text: 'API Reference', link: '/api/' },
      ] },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/karisajoshua/mizaniclinic' }],
    search: { provider: 'local' },
  },
});
