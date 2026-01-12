export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-5xl px-0 py-0">
      <div className="rounded-2xl shadow-sm">
        <div className="p-6 pt-0 sm:px-5 space-y-4">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              1. Introduction
            </h2>
            <p className="text-muted-foreground">
              Welcome to Tradexs10. Your privacy is important to us. This
              privacy policy outlines how we collect, use, and protect your
              personal and financial data when you use our services for trading
              stocks, forex, and cryptocurrencies. By using our platform, you
              agree to the terms outlined in this policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              2. Information We Collect
            </h2>

            <p className="text-muted-foreground">
              We collect the following types of information:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and other identification information.
              </li>
              <li>
                <strong>Financial Data:</strong> Transaction history, account
                balances, trading activity, and other data necessary for
                financial processing.
              </li>
              <li>
                <strong>Device and Usage Information:</strong> IP address,
                browser type, device information, and user interactions with the
                platform.
              </li>
            </ul>
          </section>

          {/* 2.1 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-primary">
              2.1 Financial Data Collection
            </h3>
            <p className="text-muted-foreground">
              As part of our services, we collect sensitive financial data such
              as your trading history, account balances, transaction records,
              and other data necessary to process and verify trades. We may also
              request identity verification information to comply with Know Your
              Customer (KYC) and Anti-Money Laundering (AML) regulations.
            </p>
          </section>

          {/* 2.2 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-primary">
              2.2 Use of Financial Data
            </h3>
            <p className="text-muted-foreground">
              The financial data we collect is used for processing your
              transactions, providing real-time market data, offering trade
              analysis tools, and ensuring compliance with regulatory
              requirements. We may also use this data to detect and prevent
              fraud or suspicious activities on our platform.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              3. How We Use Your Information
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and improve our trading services.</li>
              <li>To process transactions and provide account management.</li>
              <li>
                To comply with legal and regulatory obligations (e.g., KYC,
                AML).
              </li>
              <li>
                To send transaction confirmations, market updates, and other
                important notices.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              4. Compliance with Regulations
            </h2>
            <p className="text-muted-foreground">
              We comply with applicable laws and regulations, including Know
              Your Customer (KYC) and Anti-Money Laundering (AML) requirements.
              By using our platform, you agree to provide any information or
              documentation necessary to verify your identity or trading
              activity, as required by law.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              5. Cryptocurrency Transactions
            </h2>
            <p className="text-muted-foreground">
              If you engage in cryptocurrency transactions on our platform, we
              may collect and store information related to your crypto wallet
              addresses, transaction hashes, and crypto holdings. Please be
              aware that cryptocurrency transactions are irreversible, and we
              cannot offer refunds or chargebacks for any cryptocurrency trades.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              6. Security of Financial Transactions
            </h2>
            <p className="text-muted-foreground">
              We implement robust security measures to protect your financial
              transactions, including encryption of sensitive data, multi-
              factor authentication (MFA), and secure storage. However, no
              system is completely secure.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              7. Risk Disclosure
            </h2>
            <p className="text-muted-foreground">
              Trading stocks, forex, and cryptocurrencies involves significant
              risk, including loss of capital. You acknowledge and accept these
              risks when using our platform.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              8. Data Sharing and Disclosure
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To comply with legal obligations.</li>
              <li>
                With service providers operating under strict confidentiality
                agreements.
              </li>
            </ul>
          </section>

          {/* 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              9. Your Rights and Choices
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and correct your personal data.</li>
              <li>Withdraw consent for certain processing activities.</li>
              <li>Request data deletion (subject to legal requirements).</li>
            </ul>
          </section>

          {/* 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this privacy policy periodically. Changes will be
              posted on this page with an updated date.
            </p>
          </section>

          {/* 11 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
              11. Contact Us
            </h2>
            <p className="text-muted-foreground">
              Tradexs10
              <br />
              Email: support@tradexs10.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
