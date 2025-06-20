import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumbs } from '../components/breadcrumb.component';

@Component({
  selector: 'app-privay-policy',
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs
        [breadcrumbs]="[{ url: '/privacy-policy', label: 'Privacy Policy' }]"
      />
    </div>

    <div class="grid place-items-center mt-10 text-2xl min-h-screen">
      <div class="prose dark:prose-invert mx-auto max-w-3xl text-gray-700 dark:text-gray-400 text-lg mb-[100px]">
        <h1>Privacy Policy for JustAngular</h1>
        <p>Effective Date: June 20, 2025</p>
        <p>
          Your privacy is important to us. This Privacy Policy explains how
          JustAngular collects, uses, and protects information related to your
          use of our website, specifically concerning Google Analytics for site
          improvement and your voluntary subscription to our newsletter.
        </p>
        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        
        <h3>Google Analytics Data (Usage Data)</h3>
        <p>
          When you visit our website, we use Google Analytics, a web analytics service provided
          by Google, Inc. (&quot;Google&quot;). Google Analytics collects
          information about your use of the website, such as:
        </p>
        <ul>
          <li>Your IP address (anonymized)</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring pages</li>
          <li>Pages you visit on our site</li>
          <li>Time spent on those pages</li>
          <li>Date and time of your visit</li>
          <li>Other diagnostic data</li>
        </ul>
        <p>
          This data is collected to help us understand how visitors interact
          with our website, identify popular content, and improve our services.
          This data is aggregated and does not directly identify you.
        </p>

        <h3>Newsletter Subscription Data (Personal Data)</h3>
        <p>
          If you choose to subscribe to our newsletter, we collect the following
          personal data:
        </p>
        <ul>
          <li>Your email address</li>
          <li>(Optional: Your name, if provided in the subscription form)</li>
        </ul>
        <p>
          This data is collected solely for the purpose of sending you our
          newsletter and related communications.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>
            <strong>To Improve Our Website:</strong> Google Analytics data helps
            us analyze website traffic and user behavior, allowing us to
            identify areas for improvement, optimize content, and enhance the
            overall user experience.
          </li>
          <li>
            <strong>To Send Newsletters:</strong> Your email address (and name,
            if provided) is used to send you our newsletter, which may include
            updates, articles, and other information related to JustAngular.
          </li>
        </ul>
        <h2>3. Data Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally
          identifiable information (like your email address) to outside parties
          for marketing purposes.
        </p>
        <h3>Google Analytics</h3>
        <p>
          Google may use the data collected
          to contextualize and personalize the ads of its own advertising
          network. You can learn more about Google's privacy practices at the
          Google Privacy &amp; Terms page:
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >https://policies.google.com/privacy</a
          >.
        </p>
        <h3>Service Providers</h3>
        <p>
          We may use third-party service
          providers (e.g., email marketing platforms) to manage our newsletter
          subscriptions and send emails on our behalf. These service providers
          are obligated to protect your information and use it only for the
          purposes for which we provide it to them.
        </p>
        <h2>4. Your Choices and Rights</h2>
        <h3>Google Analytics Opt-Out</h3>
        <p>
          You can opt-out of Google
          Analytics tracking by installing the Google Analytics opt-out browser
          add-on, which prevents Google Analytics JavaScript (ga.js,
          analytics.js, and dc.js) from sharing information with Google
          Analytics about visits activity. You can find more information here:
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            >https://tools.google.com/dlpage/gaoptout</a
          >.
        </p>
        <h3>Newsletter Unsubscribe</h3>
        <p>
          You can unsubscribe from our
          newsletter at any time by clicking the &quot;unsubscribe&quot; link
          provided at the bottom of every newsletter email.
        </p>
        <h2>5. Data Security</h2>
        <p>
          We are committed to protecting the security of your information. We
          implement reasonable security measures to protect against unauthorized
          access, alteration, disclosure, or destruction of your personal data,
          especially your email address used for newsletter subscriptions.
        </p>
        <h2>6. Children's Privacy</h2>
        <p>
          Our website is not intended for anyone under the age of 13. We do not
          knowingly collect personally identifiable information from anyone
          under 13. If you are a parent or guardian and you are aware that your
          child has provided us with personal data, please contact us. If we
  
          become aware that we have collected personal data from anyone under
          the age of 13 without verification of parental consent, we take steps
          to remove that information from our servers.
        </p>
        <h2>7. Links to Other Websites</h2>
        <p>
          Our website may contain links to other websites that are not operated
          by us. If you click on a third-party link, you will be directed to
          that third party's site. We strongly advise you to review the Privacy
          Policy of every site you visit. We have no control over and assume no
          responsibility for the content, privacy policies, or practices of any
          third-party sites or services.
        </p>
        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. We will
          let you know via a prominent notice on our website prior to the change
          becoming effective and update the &quot;Effective Date&quot; at the
          top of this Privacy Policy. You are advised to review this Privacy
          Policy periodically for any changes.
        </p>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <p>
          By email:
          <a href="mailto:jahollarienea14@gmail.com"
            >jahollarienea14&#64;gmail.com</a
          >
        </p>
      </div>
    </div>
  `,
  styles: `
    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs],
})
export default class PrivayPolicy { }
