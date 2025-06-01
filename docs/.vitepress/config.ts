
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Mizani Clinic Ambassador',
  description: 'Complete documentation for the Mizani Clinic Ambassador referral and healthcare booking platform',
  base: '/docs/',
  
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Mizani Clinic Ambassador',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/user-guide/' },
      { text: 'Admin Guide', link: '/admin-guide/' },
      { text: 'Developer', link: '/developer/' },
      { text: 'API Reference', link: '/api/' }
    ],

    sidebar: {
      '/user-guide/': [
        {
          text: 'User Guide',
          items: [
            { text: 'Getting Started', link: '/user-guide/' },
            { text: 'Registration', link: '/user-guide/registration' },
            { text: 'Dashboard Overview', link: '/user-guide/dashboard' },
            { text: 'Referral Management', link: '/user-guide/referrals' },
            { text: 'Earnings Tracking', link: '/user-guide/earnings' },
            { text: 'Appointment Booking', link: '/user-guide/appointments' },
            { text: 'Payment Processing', link: '/user-guide/payments' }
          ]
        }
      ],
      
      '/admin-guide/': [
        {
          text: 'Admin Guide',
          items: [
            { text: 'Overview', link: '/admin-guide/' },
            { text: 'Dashboard', link: '/admin-guide/dashboard' },
            { text: 'User Management', link: '/admin-guide/users' },
            { text: 'Financial Management', link: '/admin-guide/finance' },
            { text: 'Geographic Management', link: '/admin-guide/geography' },
            { text: 'System Configuration', link: '/admin-guide/config' },
            { text: 'Analytics & Reports', link: '/admin-guide/analytics' }
          ]
        }
      ],

      '/developer/': [
        {
          text: 'Developer Guide',
          items: [
            { text: 'Getting Started', link: '/developer/' },
            { text: 'Project Structure', link: '/developer/structure' },
            { text: 'Architecture', link: '/developer/architecture' },
            { text: 'Database Schema', link: '/developer/database' },
            { text: 'Authentication', link: '/developer/auth' },
            { text: 'Components', link: '/developer/components' },
            { text: 'Hooks', link: '/developer/hooks' },
            { text: 'Business Logic', link: '/developer/business-logic' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/auth' },
            { text: 'Users', link: '/api/users' },
            { text: 'Referrals', link: '/api/referrals' },
            { text: 'Payments', link: '/api/payments' },
            { text: 'Appointments', link: '/api/appointments' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mizani-clinic/ambassador-app' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Mizani Clinic'
    },

    search: {
      provider: 'local'
    }
  }
})
