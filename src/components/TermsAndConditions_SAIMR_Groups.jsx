import React, { useState } from "react";

// Terms & Conditions component for SAIMR Groups
// Single-file React component using Tailwind CSS for styling.
// Drop this file into your React project and import where needed.

export default function TermsAndConditionsSaimr() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <header className="px-6 py-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <h1 className="text-2xl md:text-4xl font-serif font-bold">SAIMR Groups — Terms & Conditions</h1>
          <p className="text-sm opacity-90 mt-2 font-light tracking-wide">Effective date: <strong>{new Date().toLocaleDateString()}</strong></p>
        </header>

        <main className="p-6 md:p-10 space-y-8">
          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              These Terms & Conditions ("Agreement") govern the relationship between you ("Client", "Buyer", or
              "Seller") and SAIMR Groups ("Company", "we", "us", "our") in connection with services related to
              real estate transactions including outright sales, Joint Development (JD), Joint Venture (JV), industrial
              land and farmland (collectively, "Properties"). By using our services you agree to be bound by this
              Agreement.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">2. Definitions</h2>
            <ul className="list-disc list-inside leading-relaxed text-gray-700 font-light space-y-2">
              <li><strong className="font-semibold">Client:</strong> Any person or entity using our services.</li>
              <li><strong className="font-semibold">Property:</strong> Any real estate offered, marketed, managed, or transacted by SAIMR Groups.</li>
              <li><strong className="font-semibold">Outright Sale:</strong> Traditional sale where full title transfers to the Buyer.</li>
              <li><strong className="font-semibold">JD / JV:</strong> Joint Development or Joint Venture arrangements between landowners and
                developers or partners.</li>
            </ul>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">3. Scope of Services</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              We provide one or more of the following services: marketing of Properties, brokering sales, facilitating
              JD/JV agreements, project management, due diligence assistance, introductions to legal/finance partners,
              valuation support, and post-sale coordination. Specific terms for each engagement will be set out in a
              separate engagement letter, listing, or agreement.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">4. Client Representations & Warranties</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Each Client represents and warrants that they have authority to enter into transactions, that the
              information they provide is accurate to the best of their knowledge, and that they will cooperate with
              reasonable requests for documents, access, and signatures required to complete transactions.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">5. JD / JV Specific Terms</h2>
            <p className="leading-relaxed text-gray-700 font-light mb-3">
              JD and JV arrangements are bespoke and often complex. Unless otherwise agreed in writing:
            </p>
            <ul className="list-disc list-inside leading-relaxed text-gray-700 font-light space-y-2">
              <li>We will assist in negotiating commercial terms but will not unilaterally bind parties without express
                written authority.</li>
              <li>Profit sharing, construction timelines, approvals, statutory compliances, and cost overruns will be
                governed by the JD/JV agreement signed by the parties.</li>
              <li>Landowners must disclose any encumbrances, litigation, or claims affecting the land prior to entering
                into an agreement.</li>
            </ul>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">6. Fees & Payment</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Our fees (brokerage, commission, advisory, facilitation fees) will be agreed in writing before we commence
              work. Unless stated otherwise, fees become payable on achievement of specified milestones such as
              execution of sale agreement, transfer of title, or financial closing. All payments are exclusive of taxes,
              duties or statutory levies, which are payable by the Client in addition.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">7. Due Diligence & Inspections</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Clients are responsible for conducting their own due diligence, physical inspections, surveys, and legal
              checks. We may provide assistance and introduce third-party professionals, but such introductions do not
              constitute a warranty or guarantee of their services.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">8. Title, Transfer & Documentation</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Transfer of title and registration will be governed by applicable laws. The Seller must provide marketable
              title free of undisclosed encumbrances at the time of sale, unless otherwise disclosed in writing. We are
              not a substitute for legal counsel — Clients should seek independent legal advice for documentation,
              title searches, and registrations.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">9. Taxes, Duties & Charges</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Taxes, stamp duties, registration fees, and other governmental charges arising from a transaction are the
              responsibility of the parties as determined under law or as agreed in writing in the transaction documents.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">10. Confidentiality</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              We will treat confidential information provided by a Client as private and will not disclose it to third
              parties except as required to perform our services, as required by law, or with the Client's consent.
              Confidential information does not include information already in the public domain or independently
              developed information.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">11. Limitation of Liability</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              To the fullest extent permitted by applicable law, SAIMR Groups and its officers, agents and employees
              shall not be liable for any indirect, special, incidental, consequential or punitive damages arising out of
              or connected with our services. Our aggregate liability for direct damages will be limited to the fees paid
              to us in respect of the transaction giving rise to the claim.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">12. Indemnity</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Clients agree to indemnify and hold SAIMR Groups harmless from any claims, losses, liabilities or costs
              (including reasonable legal fees) arising out of breach of these Terms, misrepresentations, or negligent
              acts by the Client.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">13. Termination</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Either party may terminate an engagement in accordance with the termination provisions specified in the
              engagement letter or agreement. Termination does not relieve the Client of obligations to pay fees for work
              already performed or reimbursable expenses incurred prior to termination.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">14. Force Majeure</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              Neither party shall be liable for failure or delay in performing obligations caused by events beyond their
              reasonable control ("Force Majeure") including natural disasters, governmental actions, strikes or
              pandemics. The impacted party must notify the other party and use reasonable efforts to mitigate the
              effects.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">15. Governing Law & Dispute Resolution</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              This Agreement shall be governed by the laws of the jurisdiction where the Property is located unless
              otherwise agreed. Parties shall attempt to resolve disputes amicably; failing which disputes shall be
              referred to arbitration or the courts as agreed in the specific transaction documents.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">16. Amendments</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              We may update these Terms & Conditions from time to time. Material changes will be communicated to
              Clients through email or by posting an updated version on our website. Continued use of our services after
              changes implies acceptance of the revised Terms.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">17. Severability</h2>
            <p className="leading-relaxed text-gray-700 font-light">
              If any provision of this Agreement is held invalid or unenforceable, the remainder of the Agreement will
              continue in full force and effect.
            </p>
          </section>

          <section className="pb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">18. Contact Information</h2>
            <p className="leading-relaxed text-gray-700 font-light mb-3">
              For questions about these Terms & Conditions or to notify us, please contact:
            </p>
            <address className="not-italic leading-relaxed text-gray-700 font-light">
              <strong className="font-semibold">SAIMR Groups</strong><br />
              Email: <a href="mailto:saimrgroups@gmail.com" className="underline hover:text-gray-900 transition-colors">saimrgroups@gmail.com</a><br />
              Phone: +91 77889 99022
            </address>
          </section>

          <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <input
                id="accept"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-5 w-5 rounded border-gray-400 text-gray-900 focus:ring-gray-500"
              />
              <label htmlFor="accept" className="text-sm text-gray-700 font-medium">
                I have read and agree to the SAIMR Groups Terms & Conditions.
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-lg border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 text-sm font-medium tracking-wide"
              >
                Print / Save
              </button>
              <button
                disabled={!accepted}
                onClick={() => alert("Thank you — your acceptance has been recorded.")}
                className={`px-6 py-3 rounded-lg text-white text-sm font-medium tracking-wide transition-all duration-200 ${
                  accepted 
                    ? "bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Accept & Continue
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 font-light">Disclaimer: This document is a general-purpose template and does not
            constitute legal advice. For transaction-specific or jurisdiction-specific legal terms, consult a qualified
            lawyer.</p>
        </main>

        <footer className="px-6 py-6 bg-gray-100 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center font-light tracking-wide">
            © {new Date().getFullYear()} SAIMR Groups. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}