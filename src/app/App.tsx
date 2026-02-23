import { useState } from 'react';
import { Backpack, Compass, Tent, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetData {
  bambiniTotali: number;
  bambiniPernotto: number;
  trasportoBambino: number;
  trasportoCapi: number;
  numeroCapi: number;
  offertaSede: number;
  spesaCibo: number;
  materialiAttivita: number;
  quotaGiorno: number;
  quotaPernotto: number;
  quotaCapiDiCassa: boolean;
  importoCapiDiCassa: number;
}

export default function App() {
  const [data, setData] = useState<BudgetData>({
    bambiniTotali: 0,
    bambiniPernotto: 0,
    trasportoBambino: 0,
    trasportoCapi: 0,
    numeroCapi: 0,
    offertaSede: 0,
    spesaCibo: 0,
    materialiAttivita: 0,
    quotaGiorno: 0,
    quotaPernotto: 0,
    quotaCapiDiCassa: false,
    importoCapiDiCassa: 0,
  });

  const updateField = (field: keyof BudgetData, value: number | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Calcoli
  const bambiniGiorno = data.bambiniTotali - data.bambiniPernotto;
  
  const usciteTotali =
    data.trasportoBambino * data.bambiniTotali +
    data.trasportoCapi * data.numeroCapi +
    data.offertaSede +
    data.spesaCibo +
    data.materialiAttivita;

  // Entrate: quote bambini + eventualmente quota capi di cassa
  const entrateBambini =
    data.quotaGiorno * bambiniGiorno + data.quotaPernotto * data.bambiniPernotto;
  
  const entrateCapi = data.quotaCapiDiCassa 
    ? data.importoCapiDiCassa * data.numeroCapi 
    : 0;
  
  const entrateTotali = entrateBambini + entrateCapi;

  const bilancio = entrateTotali - usciteTotali;
  
  // Se quota capi è a carico bambini, dividiamo le uscite per i bambini
  // Se quota capi è di cassa, sottraiamo l'entrata dei capi dalle uscite prima di dividere
  const usciteDaCopriereConBambini = data.quotaCapiDiCassa 
    ? usciteTotali - entrateCapi 
    : usciteTotali;
  
  const quotaMedia = data.bambiniTotali > 0 ? usciteDaCopriereConBambini / data.bambiniTotali : 0;

  const impostaQuotePareggio = () => {
    setData((prev) => ({
      ...prev,
      quotaGiorno: Math.ceil(quotaMedia * 100) / 100,
      quotaPernotto: Math.ceil(quotaMedia * 1.2 * 100) / 100,
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-6 md:p-8" style={{ fontFamily: 'Prompt, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Backpack className="w-8 h-8 text-[#482878]" />
            <h1 className="text-4xl font-bold text-[#482878] text-center" style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 900 }}>
              Ma quanto ci costa?
            </h1>
            <Compass className="w-8 h-8 text-[#482878]" />
            <Tent className="w-7 h-7 text-[#482878]" />
          </div>
          <p className="text-center text-[#8b6f47] text-lg">
            Calcola le quote per la tua uscita scout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonna Sinistra */}
          <div className="space-y-6">
            {/* Sezione Partecipanti */}
            <div className="bg-white rounded-lg shadow-md border-2 border-[#8b6f47] p-6">
              <h2 className="text-2xl font-normal text-[#482878] mb-4 border-b-2 border-[#482878] pb-2">
                👥 Partecipanti
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Bambini totali"
                  value={data.bambiniTotali}
                  onChange={(v) => updateField('bambiniTotali', v)}
                />
                <InputField
                  label="Bambini con pernotto"
                  value={data.bambiniPernotto}
                  onChange={(v) => updateField('bambiniPernotto', v)}
                />
                <div className="text-sm text-[#8b6f47] mt-2 bg-[#f5f1e8] p-2 rounded">
                  Bambini solo giorno: <strong>{bambiniGiorno}</strong>
                </div>
              </div>
            </div>

            {/* Sezione Extra */}
            <div className="bg-white rounded-lg shadow-md border-2 border-[#8b6f47] p-6">
              <h2 className="text-2xl font-normal text-[#482878] mb-4 border-b-2 border-[#482878] pb-2">
                🎒 Extra
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Spesa cibo (€)"
                  value={data.spesaCibo}
                  onChange={(v) => updateField('spesaCibo', v)}
                  step={0.1}
                />
                <InputField
                  label="Materiali o attività (€)"
                  value={data.materialiAttivita}
                  onChange={(v) => updateField('materialiAttivita', v)}
                  step={0.1}
                />
              </div>
            </div>
          </div>

          {/* Colonna Destra */}
          <div className="space-y-6">
            {/* Sezione Trasporti e Sede */}
            <div className="bg-white rounded-lg shadow-md border-2 border-[#8b6f47] p-6">
              <h2 className="text-2xl font-normal text-[#482878] mb-4 border-b-2 border-[#482878] pb-2">
                🚂 Trasporti e Sede
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Trasporto bambino (€)"
                  value={data.trasportoBambino}
                  onChange={(v) => updateField('trasportoBambino', v)}
                  step={0.1}
                />
                <InputField
                  label="Trasporto capi (€)"
                  value={data.trasportoCapi}
                  onChange={(v) => updateField('trasportoCapi', v)}
                  step={0.1}
                />
                <InputField
                  label="Numero capi"
                  value={data.numeroCapi}
                  onChange={(v) => updateField('numeroCapi', v)}
                />
                <InputField
                  label="Offerta sede (€)"
                  value={data.offertaSede}
                  onChange={(v) => updateField('offertaSede', v)}
                  step={0.1}
                />
                
                {/* Opzione quota capi */}
                <div className="mt-4 pt-4 border-t border-[#8b6f47]">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-[#482878] block mb-2">
                      Le quote dei capi sono spalmate nelle quote dei bambini?
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateField('quotaCapiDiCassa', false)}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          !data.quotaCapiDiCassa
                            ? 'bg-[#482878] text-white'
                            : 'bg-white border-2 border-[#8b6f47] text-[#8b6f47] hover:border-[#482878]'
                        }`}
                      >
                        Sì
                      </button>
                      <button
                        onClick={() => updateField('quotaCapiDiCassa', true)}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          data.quotaCapiDiCassa
                            ? 'bg-[#482878] text-white'
                            : 'bg-white border-2 border-[#8b6f47] text-[#8b6f47] hover:border-[#482878]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  
                  {data.quotaCapiDiCassa && (
                    <div className="mt-3">
                      <InputField
                        label="Importo per capo (€)"
                        value={data.importoCapiDiCassa}
                        onChange={(v) => updateField('importoCapiDiCassa', v)}
                        step={0.1}
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-[#8b6f47] mt-2">
                    {data.quotaCapiDiCassa 
                      ? "I capi contribuiscono di tasca propria o dalla cassa di branca" 
                      : "La quota dei capi è spalmata nelle quote dei bambini"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sezione inferiore: Quote e Risultati affiancati */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Quote */}
          <div className="bg-white rounded-lg shadow-md border-2 border-[#8b6f47] p-6">
            <h2 className="text-2xl font-normal text-[#482878] mb-4 border-b-2 border-[#482878] pb-2">
              💰 Quote
            </h2>
            <div className="space-y-4">
              <InputField
                label="Quota solo giorno (€)"
                value={data.quotaGiorno}
                onChange={(v) => updateField('quotaGiorno', v)}
                step={0.1}
              />
              <InputField
                label="Quota pernotto (€)"
                value={data.quotaPernotto}
                onChange={(v) => updateField('quotaPernotto', v)}
                step={0.1}
              />
              
              <div className="mt-4 p-4 bg-[#f5f1e8] rounded border border-[#8b6f47]">
                <div className="text-sm text-[#8b6f47] mb-2">
                  Quota media di pareggio: <strong className="text-[#482878] text-lg">€ {quotaMedia.toFixed(2)}</strong>
                </div>
                <button
                  onClick={impostaQuotePareggio}
                  className="w-full mt-2 bg-[#482878] text-white py-2 px-4 rounded-lg font-normal hover:bg-[#5a3694] transition-colors"
                >
                  Calcola quote
                </button>
              </div>
            </div>
          </div>

          {/* Risultati */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-[#482878] p-6 relative overflow-hidden">
            <h2 className="text-2xl font-normal text-[#482878] mb-4 border-b-2 border-[#482878] pb-2">
              📊 Risultati
            </h2>
            <div className="space-y-4">
              <ResultRow
                label="Uscite totali"
                value={usciteTotali}
                icon={<TrendingDown className="w-5 h-5 text-red-600" />}
                color="text-red-600"
              />
              <ResultRow
                label="Entrate totali"
                value={entrateTotali}
                icon={<TrendingUp className="w-5 h-5 text-[#482878]" />}
                color="text-[#482878]"
              />
              <div className="border-t-2 border-[#8b6f47] pt-4">
                <ResultRow
                  label="Bilancio finale"
                  value={bilancio}
                  large
                  color={bilancio >= 0 ? 'text-[#482878]' : 'text-red-600'}
                />
              </div>
            </div>

            {/* Timbro IN ATTIVO */}
            <AnimatePresence>
              {bilancio > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: -12, opacity: 1 }}
                  exit={{ scale: 0, rotate: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute top-4 right-4"
                >
                  <div className="bg-[#482878] text-white font-bold text-xl px-6 py-3 rounded-lg border-4 border-[#482878] shadow-xl transform rotate-[-12deg]">
                    IN ATTIVO
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente InputField
function InputField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#482878] mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step={step}
        min="0"
        className="w-full px-4 py-2 border-2 border-[#8b6f47] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482878] focus:border-transparent bg-white"
      />
    </div>
  );
}

// Componente ResultRow
function ResultRow({
  label,
  value,
  icon,
  color = 'text-gray-900',
  large = false,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className={`font-medium ${large ? 'text-xl' : 'text-base'}`}>
          {label}
        </span>
      </div>
      <span className={`font-bold ${large ? 'text-2xl' : 'text-lg'} ${color}`}>
        € {value.toFixed(2)}
      </span>
    </div>
  );
}