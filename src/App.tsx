/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, Info, Share2, Check, BarChart3, HelpCircle, Target, Printer, Globe } from 'lucide-react';

export default function App() {
  // --- State Management for Input Fields ---
  const [sellPrice, setSellPrice] = useState<number>(() => Number(localStorage.getItem('roas_sellPrice')) || 100);
  const [cogs, setCogs] = useState<number>(() => Number(localStorage.getItem('roas_cogs')) || 25);
  const [shipping, setShipping] = useState<number>(() => Number(localStorage.getItem('roas_shipping')) || 10);
  const [cpa, setCpa] = useState<number>(() => Number(localStorage.getItem('roas_cpa')) || 20);
  
  // Advanced Features (The "Unfair Advantage")
  const [paymentFee, setPaymentFee] = useState<number>(() => Number(localStorage.getItem('roas_paymentFee')) || 2.9);
  const [returnRate, setReturnRate] = useState<number>(() => Number(localStorage.getItem('roas_returnRate')) || 5.0);
  
  // Global Reach Feature
  const [currency, setCurrency] = useState<string>(() => localStorage.getItem('roas_currency') || '$');
  
  const [copied, setCopied] = useState(false);

  // --- State Management for Output Fields ---
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [grossMargin, setGrossMargin] = useState<number>(0);
  const [breakEvenRoas, setBreakEvenRoas] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [netMargin, setNetMargin] = useState<number>(0);

  // --- Real-time Calculation Logic & LocalStorage Persistence ---
  useEffect(() => {
    localStorage.setItem('roas_sellPrice', sellPrice.toString());
    localStorage.setItem('roas_cogs', cogs.toString());
    localStorage.setItem('roas_shipping', shipping.toString());
    localStorage.setItem('roas_cpa', cpa.toString());
    localStorage.setItem('roas_paymentFee', paymentFee.toString());
    localStorage.setItem('roas_returnRate', returnRate.toString());
    localStorage.setItem('roas_currency', currency);

    // Advanced Math incorporating real-world e-commerce variables
    const feeCost = sellPrice * (paymentFee / 100);
    const returnCost = sellPrice * (returnRate / 100); // Simplified return cost impact
    
    const gp = sellPrice - cogs - shipping - feeCost - returnCost;
    const gm = sellPrice > 0 ? (gp / sellPrice) * 100 : 0;
    const beRoas = gp > 0 ? sellPrice / gp : 0;
    const np = gp - cpa;
    const nm = sellPrice > 0 ? (np / sellPrice) * 100 : 0;

    setGrossProfit(gp);
    setGrossMargin(gm);
    setBreakEvenRoas(beRoas);
    setNetProfit(np);
    setNetMargin(nm);
  }, [sellPrice, cogs, shipping, cpa, paymentFee, returnRate, currency]);

  const handleInput = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setter(isNaN(val) ? 0 : val);
  };

  const copyReport = () => {
    const report = `📊 Advanced E-Commerce Profitability Report\n\n` +
      `Inputs:\n` +
      `- Sell Price: ${currency}${sellPrice}\n` +
      `- COGS & Shipping: ${currency}${cogs + shipping}\n` +
      `- Fees & Returns: ${paymentFee}% / ${returnRate}%\n` +
      `- CPA: ${currency}${cpa}\n\n` +
      `Results:\n` +
      `- Max Target CPA (Break-even): ${currency}${grossProfit.toFixed(2)}\n` +
      `- Gross Margin: ${grossMargin.toFixed(1)}%\n` +
      `- Break-even ROAS: ${breakEvenRoas.toFixed(2)}x\n` +
      `- Net Profit: ${currency}${netProfit.toFixed(2)} (${netMargin.toFixed(1)}%)\n\n` +
      `Calculate yours at: ${window.location.origin}`;
    
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  // Calculate percentages for the Revenue Breakdown Bar
  const safeSellPrice = sellPrice > 0 ? sellPrice : 1;
  const pctCogs = ((cogs + shipping) / safeSellPrice) * 100;
  const pctFees = ((sellPrice * (paymentFee / 100) + sellPrice * (returnRate / 100)) / safeSellPrice) * 100;
  const pctCpa = (cpa / safeSellPrice) * 100;
  const pctProfit = Math.max(0, (netProfit / safeSellPrice) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 font-sans selection:bg-[#CCFF00]/30 pb-20 md:pb-8 flex flex-col items-center print:bg-white print:text-black">
      
      {/* --- MONETIZATION SPOT 1: Top Leaderboard --- */}
      <div id="ad-top-leaderboard" className="w-full h-[90px] bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-center mb-8 shrink-0 print:hidden">
        <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Advertisement (728x90)</span>
      </div>

      <main className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:max-w-full">
        
        {/* Left Column: Main Calculator Area */}
        <div className="lg:col-span-8 space-y-8 print:w-full">
          
          {/* Header Section */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight flex items-center gap-3 print:text-black">
                <Calculator className="w-8 h-8 text-[#CCFF00] print:text-black" />
                Advanced ROAS Calculator
              </h1>
              <p className="text-zinc-400 print:text-zinc-600">The most accurate e-commerce profit calculator. Includes fees & return rates.</p>
            </div>
            
            <div className="flex items-center gap-2 print:hidden">
              {/* Currency Selector */}
              <div className="relative flex items-center bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2">
                <Globe className="w-4 h-4 text-zinc-500 mr-2" />
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-zinc-300 text-sm font-semibold uppercase tracking-wider focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  <option value="$" className="bg-[#141414] text-zinc-300">USD ($)</option>
                  <option value="€" className="bg-[#141414] text-zinc-300">EUR (€)</option>
                  <option value="£" className="bg-[#141414] text-zinc-300">GBP (£)</option>
                  <option value="A$" className="bg-[#141414] text-zinc-300">AUD (A$)</option>
                  <option value="C$" className="bg-[#141414] text-zinc-300">CAD (C$)</option>
                </select>
              </div>

              <button 
                onClick={printReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-zinc-300 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider shrink-0"
                title="Print / Save as PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button 
                id="btn-copy-report"
                onClick={copyReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-[#b3e600] text-black rounded-lg transition-colors text-sm font-bold uppercase tracking-wider shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </header>

          {/* Inputs Grid Section */}
          <section id="calculator-inputs" className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl print:bg-white print:border-zinc-300 print:shadow-none">
            
            <InputField 
              label="Customer Sell Price" 
              value={sellPrice} 
              onChange={handleInput(setSellPrice)} 
              currencySymbol={currency}
              tooltip="The final price the customer pays for your product."
            />
            
            <InputField 
              label="Product Cost (COGS)" 
              value={cogs} 
              onChange={handleInput(setCogs)} 
              currencySymbol={currency}
              tooltip="Cost of Goods Sold: Manufacturing, packaging, etc."
            />
            
            <InputField 
              label="Shipping Cost" 
              value={shipping} 
              onChange={handleInput(setShipping)} 
              currencySymbol={currency}
              tooltip="Total cost to ship the product to the customer."
            />
            
            <InputField 
              label="Cost Per Acquisition (CPA)" 
              value={cpa} 
              onChange={handleInput(setCpa)} 
              currencySymbol={currency}
              tooltip="Total marketing spend required to acquire one customer."
            />

            {/* Advanced Inputs */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A] print:border-zinc-300">
              <InputField 
                label="Payment Processing Fee (%)" 
                value={paymentFee} 
                onChange={handleInput(setPaymentFee)} 
                icon={<Percent className="w-4 h-4 text-zinc-500" />}
                tooltip="Stripe, PayPal, or Shopify Payments fee (usually 2.9%)."
              />
              <InputField 
                label="Estimated Return Rate (%)" 
                value={returnRate} 
                onChange={handleInput(setReturnRate)} 
                icon={<Percent className="w-4 h-4 text-zinc-500" />}
                tooltip="Percentage of orders that are refunded/returned."
              />
            </div>
          </section>

          {/* Revenue Breakdown Visualization (Unfair Advantage Feature) */}
          <section id="revenue-breakdown" className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl space-y-4 print:bg-white print:border-zinc-300">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 print:text-zinc-800">
              <BarChart3 className="w-4 h-4 text-[#CCFF00] print:text-black" />
              Revenue Breakdown per {currency}100
            </h3>
            
            {/* Stacked Bar */}
            <div className="w-full h-8 flex rounded-md overflow-hidden bg-[#2A2A2A] print:border print:border-zinc-300">
              <div style={{ width: `${pctCogs}%` }} className="bg-zinc-600 h-full transition-all duration-500 print:bg-zinc-300" title="COGS & Shipping"></div>
              <div style={{ width: `${pctFees}%` }} className="bg-zinc-500 h-full transition-all duration-500 print:bg-zinc-400" title="Fees & Returns"></div>
              <div style={{ width: `${pctCpa}%` }} className="bg-purple-500 h-full transition-all duration-500 print:bg-zinc-500" title="Marketing (CPA)"></div>
              <div style={{ width: `${pctProfit}%` }} className="bg-[#CCFF00] h-full transition-all duration-500 print:bg-black" title="Net Profit"></div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 print:text-zinc-800">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-600 print:bg-zinc-300"></span> COGS & Ship</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-500 print:bg-zinc-400"></span> Fees & Returns</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 print:bg-zinc-500"></span> Ad Spend</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#CCFF00] print:bg-black"></span> Profit</div>
            </div>
          </section>

          {/* Results Grid Section */}
          <section id="calculator-results" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ResultCard 
              title="Max Target CPA (Break-even)" 
              value={`${currency}${grossProfit.toFixed(2)}`} 
              icon={<DollarSign className="w-5 h-5 text-[#CCFF00] print:text-black" />} 
            />
            <ResultCard 
              title="True Gross Margin" 
              value={`${grossMargin.toFixed(1)}%`} 
              icon={<Percent className="w-5 h-5 text-[#CCFF00] print:text-black" />} 
            />
            <ResultCard 
              title="Break-even ROAS" 
              value={`${breakEvenRoas.toFixed(2)}x`} 
              icon={<Target className="w-5 h-5 text-[#CCFF00] print:text-black" />} 
            />
          </section>

          {/* Net Profit Highlight Section */}
          <section id="net-profit-highlight" className={`relative overflow-hidden p-8 rounded-xl border transition-colors duration-300 print:bg-white print:border-zinc-300 ${netProfit > 0 ? 'bg-[#CCFF00]/5 border-[#CCFF00]/20' : netProfit < 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#141414] border-[#2A2A2A]'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 print:hidden">
              <DollarSign className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-800">Net Profit (Per Unit)</h3>
                <span className={`text-xs font-mono px-2 py-1 rounded print:bg-zinc-100 print:text-black ${netProfit > 0 ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-red-500/20 text-red-500'}`}>
                  {netMargin.toFixed(1)}% Margin
                </span>
              </div>
              <div className={`text-5xl md:text-6xl font-mono tracking-tight print:text-black ${netProfit > 0 ? 'text-[#CCFF00]' : netProfit < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                {currency}{netProfit.toFixed(2)}
              </div>
              <p className="mt-4 text-sm text-zinc-400 print:text-zinc-600 max-w-xl">
                {netProfit > 0 ? 'You are profitable! Your unit economics support scaling ad spend.' : netProfit < 0 ? 'You are losing money on each sale. You must lower CPA, reduce COGS, or increase your sell price.' : 'You are breaking exactly even. No profit, no loss.'}
              </p>
            </div>
          </section>

          {/* --- MONETIZATION SPOT 3: Native Affiliate Spot --- */}
          <a href="https://shopify.pxf.io/c/1234567/1061744/13624" target="_blank" rel="noopener noreferrer" id="ad-native-affiliate" className="block w-full group print:hidden">
            <div className="relative bg-[#141414] border border-[#2A2A2A] px-6 py-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 group-hover:border-[#CCFF00]/50 transition-colors">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-xl font-semibold text-white">Scale your profitable store</h4>
                <p className="text-zinc-400 text-sm">Get the best e-commerce platform for high-volume brands.</p>
              </div>
              <div className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-lg group-hover:bg-[#b3e600] transition-colors whitespace-nowrap">
                Start Shopify for $1/mo
              </div>
            </div>
          </a>

          {/* SEO Optimized Long-Form Content (Crucial for Ranking #1) */}
          <article id="seo-content" className="prose prose-invert prose-zinc max-w-none pt-12 border-t border-[#2A2A2A] print:hidden">
            <h2 className="text-2xl font-semibold text-white mb-4">The Ultimate E-Commerce ROAS & Profitability Guide</h2>
            
            <h3 className="text-xl font-semibold text-white mt-8 mb-3">What is Break-Even ROAS?</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Break-even ROAS (Return on Ad Spend) is the exact multiplier of revenue you need to generate from your advertising campaigns to cover all of your costs (COGS, shipping, fees, and the ad spend itself) without losing money. If your actual ROAS is higher than your Break-even ROAS, you are generating a net profit.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">Why Most Basic Calculators Fail</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Most free calculators only ask for Sell Price and COGS. This creates a dangerous illusion of profitability. Our advanced calculator includes <strong>Payment Processing Fees</strong> (like Stripe or PayPal's 2.9% + 30¢) and <strong>Return Rates</strong>. In real-world e-commerce, a 5% return rate can completely wipe out a 15% net margin if not accounted for in your initial media buying targets.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">How to Calculate Net Profit</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              The formula for true Net Profit per unit is: <br/>
              <code className="bg-[#141414] px-2 py-1 rounded text-[#CCFF00] font-mono text-sm mt-2 inline-block border border-[#2A2A2A]">Net Profit = Sell Price - (COGS + Shipping + Payment Fees + Return Costs + CPA)</code>
            </p>
          </article>

        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-8 print:hidden">
          
          {/* --- MONETIZATION SPOT 2: Sidebar Top (300x250) --- */}
          <div id="ad-sidebar-top" className="w-full h-[250px] bg-[#141414] border border-[#2A2A2A] border-dashed rounded-xl flex items-center justify-center shrink-0">
            <div className="text-center space-y-2">
              <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest block">Ad Space</span>
              <span className="text-zinc-700 text-xs font-mono block">(300x250)</span>
            </div>
          </div>

          {/* Info/Help Card */}
          <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#CCFF00]" />
              Pro Tips for Scaling
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-[#CCFF00] font-bold mt-0.5">1.</span>
                <span><strong>Know your numbers:</strong> Never scale ad spend if your Net Profit is negative. Fix unit economics first.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#CCFF00] font-bold mt-0.5">2.</span>
                <span><strong>Lower your CPA:</strong> Improve your ad creatives and landing page conversion rate to drop your acquisition cost.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#CCFF00] font-bold mt-0.5">3.</span>
                <span><strong>Increase AOV:</strong> Use upsells and bundles to increase the Sell Price without increasing the CPA.</span>
              </li>
            </ul>
          </div>

          {/* --- MONETIZATION SPOT 4: Sidebar Bottom (300x600 Half Page) --- */}
          <div id="ad-sidebar-bottom" className="hidden lg:flex w-full h-[600px] bg-[#141414] border border-[#2A2A2A] border-dashed rounded-xl items-center justify-center shrink-0 sticky top-8">
            <div className="text-center space-y-2">
              <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest block">Sticky Ad Space</span>
              <span className="text-zinc-700 text-xs font-mono block">(300x600)</span>
            </div>
          </div>

        </aside>

      </main>

      {/* --- MONETIZATION SPOT 5: Sticky Bottom Mobile Ad --- */}
      <div id="ad-mobile-sticky" className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#141414] border-t border-[#2A2A2A] flex items-center justify-center z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] print:hidden">
        <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Mobile Anchor Ad (320x50)</span>
      </div>

    </div>
  );
}

// --- Reusable Component: Input Field ---
function InputField({ label, value, onChange, icon, currencySymbol, tooltip }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon?: React.ReactNode, currencySymbol?: string, tooltip: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-800">{label}</label>
        <div className="group relative cursor-help print:hidden">
          <Info className="w-4 h-4 text-zinc-600 hover:text-[#CCFF00] transition-colors" />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#2A2A2A] text-xs text-zinc-200 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl border border-[#3A3A3A] pointer-events-none">
            {tooltip}
            <div className="absolute top-full right-1.5 border-4 border-transparent border-t-[#2A2A2A]"></div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon ? icon : <span className="text-zinc-500 font-mono">{currencySymbol}</span>}
        </div>
        <input
          type="number"
          value={value === 0 && isNaN(value) ? '' : value}
          onChange={onChange}
          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-[#CCFF00] transition-colors print:bg-white print:border-zinc-300 print:text-black"
          placeholder="0.00"
          step="0.01"
        />
      </div>
    </div>
  );
}

// --- Reusable Component: Result Card ---
function ResultCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl flex flex-col justify-between print:bg-white print:border-zinc-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A] print:bg-zinc-100 print:border-zinc-300">
          {icon}
        </div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-800">{title}</h3>
      </div>
      <div className="text-3xl font-mono text-white tracking-tight print:text-black">
        {value}
      </div>
    </div>
  );
}
