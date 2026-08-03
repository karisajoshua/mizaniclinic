import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";

const steps = [
  "Purchase your Mizani Activation Pack.",
  "Receive your Ambassador ID.",
  "Access Ambassador Training.",
  "Start sharing Mizani products.",
  "Earn commissions immediately.",
];

const benefits = [
  "Easy Compensation Plan",
  "Trusted Natural Health Products",
  "Continuous Training",
  "Ambassador Community",
  "Leadership Development",
  "Product Discounts",
  "National Recognition",
  "Long-Term Business Opportunity",
];

const formula = [
  { title: "JOIN", text: "Become a registered Ambassador." },
  { title: "USE", text: "Experience Mizani products yourself." },
  { title: "SHARE", text: "Recommend the products to others." },
  { title: "EARN", text: "Receive commissions from product sales and Activation Packs." },
];

const values = ["Health", "Integrity", "Service", "Leadership", "Growth", "Community"];

const CompensationPlan = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tanzania-grey via-white to-tanzania-grey">
      <MobileHeader />

      {/* Panel 1 - Cover */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#00122D] via-[#00122D] to-blue-900 text-white text-center">
        <div className="container mx-auto max-w-3xl space-y-5">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            MIZANI HEALTH AMBASSADOR
          </h1>
          <p className="text-xl text-blue-200 font-semibold">
            Helping Families Live Healthier Lives
          </p>
          <div className="inline-flex flex-wrap justify-center gap-3 text-sm font-black tracking-widest text-tanzania-green-light">
            <span>JOIN</span><span>•</span><span>USE</span><span>•</span><span>SHARE</span><span>•</span><span>EARN</span>
          </div>
          <p className="text-blue-200 max-w-2xl mx-auto font-medium">
            Become part of a growing community that promotes health, creates income
            opportunities, and transforms lives across East Africa.
          </p>
          <p className="text-tanzania-green-light font-bold">Simple. Fair. Sustainable.</p>
        </div>
      </section>

      {/* Panel 2 - How to become + Activation bonus */}
      <section className="px-4 py-12 bg-white">
        <div className="container mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-tanzania-navy mb-6">
              How To Become An Ambassador
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-tanzania-navy text-white font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 font-semibold pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-tanzania-green to-tanzania-green-light text-white">
            <CardContent className="p-8 text-center space-y-3">
              <h3 className="text-xl font-black tracking-wide">ACTIVATION PACK BONUS</h3>
              <p className="font-semibold opacity-90">Sponsor one new Ambassador.</p>
              <div className="text-6xl font-black">35%</div>
              <p className="font-medium opacity-90">
                One-time commission paid directly to the sponsoring Ambassador.
              </p>
              <p className="text-sm opacity-80">
                The more Ambassadors you personally introduce, the more Activation Pack
                commissions you earn.
              </p>
              <p className="text-sm font-bold">Activation Pack: $35</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Panel 3 - Product sales commission */}
      <section className="px-4 py-12 bg-tanzania-grey">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-black text-tanzania-navy mb-8 text-center">
            Product Sales Commission
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-2">
                <h3 className="font-black text-tanzania-navy text-lg">Direct Sale</h3>
                <p className="text-gray-600 font-semibold">Sell any Mizani product.</p>
                <div className="text-5xl font-black text-tanzania-green">25%</div>
                <p className="text-gray-600 font-medium">
                  Every direct product sale earns you an immediate commission.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-2">
                <h3 className="font-black text-tanzania-navy text-lg">Leadership Bonus</h3>
                <p className="text-gray-600 font-semibold">
                  When your personally sponsored Ambassador sells products.
                </p>
                <div className="text-5xl font-black text-tanzania-green">10%</div>
                <p className="text-gray-600 font-medium">
                  Paid only on your first generation.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center mt-8 text-tanzania-navy font-bold">
            No complicated levels. No binary system. No left leg or right leg.
            <br />
            <span className="text-tanzania-green">Simple and transparent.</span>
          </p>
        </div>
      </section>

      {/* Panel 4 - Why Mizani */}
      <section className="px-4 py-12 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-black text-tanzania-navy mb-8 text-center">
            Why Mizani?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 p-4 rounded-xl bg-tanzania-grey">
                <CheckCircle className="w-5 h-5 text-tanzania-green flex-shrink-0" />
                <span className="font-semibold text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel 5 - Success formula + values */}
      <section className="px-4 py-12 bg-tanzania-grey">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-black text-tanzania-navy mb-8 text-center">
            The Mizani Success Formula
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {formula.map((f) => (
              <Card key={f.title} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-black text-tanzania-green mb-2">{f.title}</div>
                  <p className="text-sm text-gray-600 font-semibold">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-black text-tanzania-navy mt-12 mb-4 text-center">
            Our Values
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {values.map((v) => (
              <span
                key={v}
                className="px-5 py-2 rounded-full bg-tanzania-navy text-white font-bold text-sm"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Panel 6 - Income opportunity */}
      <section className="px-4 py-14 bg-gradient-to-br from-[#00122D] via-[#00122D] to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black">Your Income Opportunity</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-black text-tanzania-green-light">35%</div>
              <div className="text-sm text-blue-200 font-semibold mt-1">
                Activation Pack Commission
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-black text-tanzania-green-light">25%</div>
              <div className="text-sm text-blue-200 font-semibold mt-1">
                Direct Sales Commission
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-black text-tanzania-green-light">10%</div>
              <div className="text-sm text-blue-200 font-semibold mt-1">
                First Generation Leadership
              </div>
            </div>
          </div>

          <p className="text-xl font-bold text-blue-100">
            Join the Movement — Helping Families • Building Leaders • Creating Prosperity
          </p>

          <Link to="/register">
            <Button
              size="lg"
              className="h-16 bg-gradient-to-r from-tanzania-green to-tanzania-green-light text-white text-xl font-black px-12 rounded-2xl shadow-2xl border-4 border-white/20"
            >
              BECOME AN AMBASSADOR
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>

          <div className="pt-6 space-y-1">
            <div className="font-black text-lg">MIZANI HEALTH GROUP LIMITED</div>
            <a
              href="https://wa.me/255747100100"
              className="inline-flex items-center gap-2 text-tanzania-green-light font-bold"
            >
              <Phone className="w-4 h-4" /> +255 747 100 100
            </a>
            <p className="text-blue-200 italic">
              "Changing Lives Through Better Health."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompensationPlan;
