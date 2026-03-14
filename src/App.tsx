/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, Info, Share2, Check, BarChart3, HelpCircle, Target, Printer, Globe, Trash2, Download, Zap, PieChart as PieChartIcon, Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import CookieConsent from './components/CookieConsent';

export default function App() {
  // --- State Management for Input Fields ---
  const [calcMode, setCalcMode] = useState<'ecom' | 'leadgen'>('ecom');
  
  // E-com State
  const [sellPrice, setSellPrice] = useState<number>(() => Number(localStorage.getItem('roas_sellPrice')) || 100);
  const [cogs, setCogs] = useState<number>(() => Number(localStorage.getItem('roas_cogs')) || 25);
  const [shipping, setShipping] = useState<number>(() => Number(localStorage.getItem('roas_shipping')) || 10);
  const [cpa, setCpa] = useState<number>(() => Number(localStorage.getItem('roas_cpa')) || 20);
  const [paymentFee, setPaymentFee] = useState<number>(() => Number(localStorage.getItem('roas_paymentFee')) || 2.9);
  const [returnRate, setReturnRate] = useState<number>(() => Number(localStorage.getItem('roas_returnRate')) || 5.0);
  
  // Lead Gen State
  const [leadValue, setLeadValue] = useState<number>(() => Number(localStorage.getItem('roas_leadValue')) || 500);
  const [cpc, setCpc] = useState<number>(() => Number(localStorage.getItem('roas_cpc')) || 2.50);
  const [lpConvRate, setLpConvRate] = useState<number>(() => Number(localStorage.getItem('roas_lpConvRate')) || 15);
  const [closeRate, setCloseRate] = useState<number>(() => Number(localStorage.getItem('roas_closeRate')) || 10);
  
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
    
    localStorage.setItem('roas_leadValue', leadValue.toString());
    localStorage.setItem('roas_cpc', cpc.toString());
    localStorage.setItem('roas_lpConvRate', lpConvRate.toString());
    localStorage.setItem('roas_closeRate', closeRate.toString());
    
    localStorage.setItem('roas_currency', currency);

    if (calcMode === 'ecom') {
      const feeCost = sellPrice * (paymentFee / 100);
      const returnCost = sellPrice * (returnRate / 100);
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
    } else {
      // Lead Gen Math
      const costPerLead = lpConvRate > 0 ? cpc / (lpConvRate / 100) : 0;
      const costPerAcquisition = closeRate > 0 ? costPerLead / (closeRate / 100) : 0;
      const np = leadValue - costPerAcquisition;
      const nm = leadValue > 0 ? (np / leadValue) * 100 : 0;
      const beRoas = costPerAcquisition > 0 ? leadValue / costPerAcquisition : 0;
      
      setGrossProfit(leadValue); // For lead gen, gross is just the value
      setGrossMargin(100);
      setBreakEvenRoas(beRoas);
      setNetProfit(np);
      setNetMargin(nm);
    }
  }, [sellPrice, cogs, shipping, cpa, paymentFee, returnRate, leadValue, cpc, lpConvRate, closeRate, currency, calcMode]);

  const handleInput = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setter(isNaN(val) ? 0 : val);
  };

  const clearAll = () => {
    if (calcMode === 'ecom') {
      setSellPrice(0);
      setCogs(0);
      setShipping(0);
      setCpa(0);
      setPaymentFee(0);
      setReturnRate(0);
    } else {
      setLeadValue(0);
      setCpc(0);
      setLpConvRate(0);
      setCloseRate(0);
    }
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

  const exportCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Sell Price', `${currency}${sellPrice}`],
      ['COGS', `${currency}${cogs}`],
      ['Shipping', `${currency}${shipping}`],
      ['CPA', `${currency}${cpa}`],
      ['Payment Fee (%)', `${paymentFee}%`],
      ['Return Rate (%)', `${returnRate}%`],
      ['Gross Profit', `${currency}${grossProfit.toFixed(2)}`],
      ['Gross Margin (%)', `${grossMargin.toFixed(1)}%`],
      ['Break-even ROAS', `${breakEvenRoas.toFixed(2)}x`],
      ['Net Profit', `${currency}${netProfit.toFixed(2)}`],
      ['Net Margin (%)', `${netMargin.toFixed(1)}%`]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roas_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate percentages for the Revenue Breakdown Chart
  const safeSellPrice = sellPrice > 0 ? sellPrice : 1;
  const cogsShipCost = cogs + shipping;
  const feesRetCost = (sellPrice * (paymentFee / 100)) + (sellPrice * (returnRate / 100));
  const profitVal = Math.max(0, netProfit);
  
  const chartData = [
    { name: 'COGS & Shipping', value: cogsShipCost, color: '#52525b' }, // zinc-600
    { name: 'Fees & Returns', value: feesRetCost, color: '#71717a' }, // zinc-500
    { name: 'Ad Spend (CPA)', value: cpa, color: '#a855f7' }, // purple-500
    { name: 'Net Profit', value: profitVal, color: '#CCFF00' },
  ].filter(item => item.value > 0);

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
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight flex items-start sm:items-center gap-3 print:text-black">
                <Calculator className="w-8 h-8 text-[#CCFF00] print:text-black shrink-0 mt-1 sm:mt-0" />
                <span>Advanced ROAS Calculator</span>
              </h1>
              
              {/* Calculator Mode Tabs */}
              <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-lg border border-[#2A2A2A] w-fit print:hidden">
                <button
                  onClick={() => setCalcMode('ecom')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${calcMode === 'ecom' ? 'bg-[#2A2A2A] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Calculator className="w-4 h-4" />
                  E-Commerce
                </button>
                <button
                  onClick={() => setCalcMode('leadgen')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${calcMode === 'leadgen' ? 'bg-[#2A2A2A] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Users className="w-4 h-4" />
                  Lead Gen
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 print:hidden flex-wrap">
              {/* Currency Selector */}
              <div className="relative flex items-center bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 shrink-0">
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
                onClick={clearAll}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-zinc-300 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider shrink-0"
                title="Clear All Fields"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>

              <button 
                onClick={printReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-zinc-300 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider shrink-0"
                title="Print / Save as PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button 
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-zinc-300 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider shrink-0"
                title="Export as CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button 
                id="btn-copy-report"
                onClick={copyReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#CCFF00] hover:bg-[#b3e600] text-black rounded-lg transition-colors text-sm font-bold uppercase tracking-wider shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                <span className="sm:hidden">{copied ? 'Done' : 'Copy'}</span>
              </button>
            </div>
          </header>

          {/* Inputs Grid Section */}
          <section id="calculator-inputs" className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl print:bg-white print:border-zinc-300 print:shadow-none">
            
            {calcMode === 'ecom' ? (
              <>
                <InputField 
                  label="Customer Sell Price" 
                  value={sellPrice} 
                  onChange={handleInput(setSellPrice)} 
                  currencySymbol={currency}
                  tooltip="The final price the customer pays for your product, including any markups. This is your top-line revenue per unit."
                />
                
                <InputField 
                  label="Product Cost (COGS)" 
                  value={cogs} 
                  onChange={handleInput(setCogs)} 
                  currencySymbol={currency}
                  tooltip="Cost of Goods Sold: The direct costs attributable to the production of the goods sold, including manufacturing and packaging."
                />
                
                <InputField 
                  label="Shipping Cost" 
                  value={shipping} 
                  onChange={handleInput(setShipping)} 
                  currencySymbol={currency}
                  tooltip="Total cost to ship the product to the customer, including postage, handling, and shipping materials."
                />
                
                <InputField 
                  label="Cost Per Acquisition (CPA)" 
                  value={cpa} 
                  onChange={handleInput(setCpa)} 
                  currencySymbol={currency}
                  tooltip="Cost Per Acquisition: The total marketing and advertising spend required to acquire one paying customer."
                />

                {/* Advanced Inputs */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A] print:border-zinc-300">
                  <InputField 
                    label="Payment Processing Fee (%)" 
                    value={paymentFee} 
                    onChange={handleInput(setPaymentFee)} 
                    icon={<Percent className="w-4 h-4 text-zinc-500" />}
                    tooltip="Processing fees charged by gateways like Stripe, PayPal, or Shopify Payments (typically around 2.9% + $0.30)."
                  />
                  <InputField 
                    label="Estimated Return Rate (%)" 
                    value={returnRate} 
                    onChange={handleInput(setReturnRate)} 
                    icon={<Percent className="w-4 h-4 text-zinc-500" />}
                    tooltip="The estimated percentage of orders that are refunded or returned by customers, impacting your bottom line."
                  />
                </div>
              </>
            ) : (
              <>
                <InputField 
                  label="Lifetime Value of a Lead (LTV)" 
                  value={leadValue} 
                  onChange={handleInput(setLeadValue)} 
                  currencySymbol={currency}
                  tooltip="The average total revenue a single closed lead brings to your business over their lifetime."
                />
                
                <InputField 
                  label="Cost Per Click (CPC)" 
                  value={cpc} 
                  onChange={handleInput(setCpc)} 
                  currencySymbol={currency}
                  tooltip="The average amount you pay for a single click on your ad."
                />
                
                <InputField 
                  label="Landing Page Conversion Rate (%)" 
                  value={lpConvRate} 
                  onChange={handleInput(setLpConvRate)} 
                  icon={<Percent className="w-4 h-4 text-zinc-500" />}
                  tooltip="The percentage of people who click your ad and actually submit their information to become a lead."
                />
                
                <InputField 
                  label="Lead to Sale Close Rate (%)" 
                  value={closeRate} 
                  onChange={handleInput(setCloseRate)} 
                  icon={<Percent className="w-4 h-4 text-zinc-500" />}
                  tooltip="The percentage of leads that your sales team successfully closes into paying customers."
                />
              </>
            )}
          </section>

          {/* Revenue Breakdown Visualization (Unfair Advantage Feature) */}
          {calcMode === 'ecom' && (
            <section id="revenue-breakdown" className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl space-y-4 print:bg-white print:border-zinc-300">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 print:text-zinc-800">
                <PieChartIcon className="w-4 h-4 text-[#CCFF00] print:text-black" />
                Revenue Breakdown per Unit
              </h3>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Donut Chart */}
                <div className="w-48 h-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [`${currency}${value.toFixed(2)}`, '']}
                        contentStyle={{ backgroundColor: '#2A2A2A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A] print:bg-zinc-50 print:border-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-zinc-300 print:text-zinc-700">{item.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-white print:text-black">{currency}{item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Results Grid Section */}
          <section id="calculator-results" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ResultCard 
              title={calcMode === 'ecom' ? "Max Target CPA" : "Cost Per Acquisition"} 
              value={calcMode === 'ecom' ? `${currency}${grossProfit.toFixed(2)}` : `${currency}${(leadValue - netProfit).toFixed(2)}`} 
              icon={<DollarSign className="w-5 h-5 text-[#CCFF00] print:text-black" />} 
            />
            <ResultCard 
              title={calcMode === 'ecom' ? "True Gross Margin" : "Lead Value (LTV)"} 
              value={calcMode === 'ecom' ? `${grossMargin.toFixed(1)}%` : `${currency}${leadValue.toFixed(2)}`} 
              icon={calcMode === 'ecom' ? <Percent className="w-5 h-5 text-[#CCFF00] print:text-black" /> : <DollarSign className="w-5 h-5 text-[#CCFF00] print:text-black" />} 
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
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider print:text-zinc-800">Net Profit {calcMode === 'ecom' ? '(Per Unit)' : '(Per Closed Deal)'}</h3>
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
          
          {/* Standardized CTA Button */}
          <a href="https://impact.com/" target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-[#141414] border border-[#CCFF00]/30 hover:border-[#CCFF00] hover:bg-[#CCFF00]/5 text-white rounded-xl transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#CCFF00]/10 rounded-lg group-hover:bg-[#CCFF00]/20 transition-colors">
                <Zap className="w-5 h-5 text-[#CCFF00]" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-0.5">Boost Your ROAS</h3>
                <p className="text-xs text-zinc-400">Explore top marketing tools</p>
              </div>
            </div>
          </a>

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

      <CookieConsent />
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
          <div className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-56 sm:w-64 p-3 bg-[#2A2A2A] text-xs text-zinc-200 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl border border-[#3A3A3A] pointer-events-none">
            {tooltip}
            <div className="absolute top-full right-1.5 sm:left-1/2 sm:-translate-x-1/2 sm:ml-[-4px] border-4 border-transparent border-t-[#2A2A2A]"></div>
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
