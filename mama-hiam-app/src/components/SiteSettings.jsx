import React, { useEffect } from 'react';
import { fetchSettings } from '../services/api';

const SiteSettings = () => {
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await fetchSettings();
        
        // تحديث عنوان الصفحة
        if (settings.site_title) {
          document.title = settings.site_title;
        }
        
        // تحديث أيقونة التبويب
        if (settings.tab_icon) {
          const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
          favicon.rel = 'icon';
          favicon.href = settings.tab_icon;
          if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(favicon);
          }
        }
        
        // تحديث meta description
        if (settings.seo_description) {
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
          }
          metaDescription.content = settings.seo_description;
        }
        
        // تحديث meta title
        if (settings.seo_title) {
          let metaTitle = document.querySelector('meta[property="og:title"]');
          if (!metaTitle) {
            metaTitle = document.createElement('meta');
            metaTitle.setAttribute('property', 'og:title');
            document.head.appendChild(metaTitle);
          }
          metaTitle.content = settings.seo_title;
        }
        
      } catch (error) {
        console.error('Error loading site settings:', error);
      }
    };

    loadSiteSettings();
  }, []);

  return null; // هذا المكون لا يعرض أي شيء
};

export default SiteSettings; 