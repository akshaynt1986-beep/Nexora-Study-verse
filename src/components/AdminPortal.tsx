import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  FileCode,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Search,
  Check,
  Download,
  BarChart2,
  X,
  FileText
} from 'lucide-react';
import { NexoraTheme, PYQQuestion, QuestionType, SubjectType, FormulaItem, ReferenceResource } from '../types';
import { StorageService } from '../services/storage';

export interface PYQValidationReport {
  isValid: boolean;
  totalItems: number;
  validItems: number;
  invalidItems: number;
  yearsDetected: number[];
  examsDetected: string[];
  subjectsDetected: string[];
  fieldErrors: string[];
  typeErrors: string[];
  validQuestions: PYQQuestion[];
  samplePreview?: PYQQuestion | null;
}

/**
 * Scans an uploaded/parsed JSON array of PYQ dataset items,
 * flags any missing required fields or incorrect data types,
 * and returns a structured validation summary report.
 */
export const validatePyqDataset = (parsedData: any): PYQValidationReport => {
  if (!Array.isArray(parsedData)) {
    return {
      isValid: false,
      totalItems: 0,
      validItems: 0,
      invalidItems: 0,
      yearsDetected: [],
      examsDetected: [],
      subjectsDetected: [],
      fieldErrors: ['Root data must be a JSON array of question objects.'],
      typeErrors: ['Root JSON structure is not an array.'],
      validQuestions: [],
      samplePreview: null,
    };
  }

  const totalItems = parsedData.length;
  let validItems = 0;
  let invalidItems = 0;
  const yearsSet = new Set<number>();
  const examsSet = new Set<string>();
  const subjectsSet = new Set<string>();
  const fieldErrors: string[] = [];
  const typeErrors: string[] = [];
  const validQuestions: PYQQuestion[] = [];

  parsedData.forEach((item, idx) => {
    const itemLabel = item && typeof item === 'object' && item.id ? `ID: ${item.id}` : `Item #${idx + 1}`;

    if (!item || typeof item !== 'object') {
      invalidItems++;
      if (typeErrors.length < 20) {
        typeErrors.push(`${itemLabel}: Element is not a valid JSON object (received ${typeof item}).`);
      }
      return;
    }

    const missingFields: string[] = [];
    const itemTypeErrors: string[] = [];

    // Required fields & type checks
    if (item.questionText === undefined || item.questionText === null || item.questionText === '') {
      missingFields.push('questionText');
    } else if (typeof item.questionText !== 'string') {
      itemTypeErrors.push(`'questionText' must be a string (got ${typeof item.questionText})`);
    }

    if (!item.exam) {
      missingFields.push('exam');
    } else if (typeof item.exam !== 'string') {
      itemTypeErrors.push(`'exam' must be a string (got ${typeof item.exam})`);
    }

    if (item.year === undefined || item.year === null) {
      missingFields.push('year');
    } else if (typeof item.year !== 'number' && (typeof item.year !== 'string' || isNaN(Number(item.year)))) {
      itemTypeErrors.push(`'year' must be a valid number (got ${typeof item.year})`);
    }

    if (!item.subject) {
      missingFields.push('subject');
    } else if (typeof item.subject !== 'string') {
      itemTypeErrors.push(`'subject' must be a string (got ${typeof item.subject})`);
    }

    if (!item.chapter) {
      missingFields.push('chapter');
    } else if (typeof item.chapter !== 'string') {
      itemTypeErrors.push(`'chapter' must be a string (got ${typeof item.chapter})`);
    }

    if (!item.questionType) {
      missingFields.push('questionType');
    } else if (typeof item.questionType !== 'string') {
      itemTypeErrors.push(`'questionType' must be a string (got ${typeof item.questionType})`);
    }

    // Optional fields type checks
    if (item.options !== undefined && !Array.isArray(item.options)) {
      itemTypeErrors.push(`'options' must be an array of string choices`);
    }

    if (item.correctAnswerIndex !== undefined && typeof item.correctAnswerIndex !== 'number' && isNaN(Number(item.correctAnswerIndex))) {
      itemTypeErrors.push(`'correctAnswerIndex' must be a valid number index`);
    }

    if (missingFields.length > 0) {
      invalidItems++;
      if (fieldErrors.length < 20) {
        fieldErrors.push(`${itemLabel}: Missing required field(s) [${missingFields.join(', ')}]`);
      }
    } else if (itemTypeErrors.length > 0) {
      invalidItems++;
      if (typeErrors.length < 20) {
        typeErrors.push(`${itemLabel}: Data type error(s) [${itemTypeErrors.join('; ')}]`);
      }
    } else {
      validItems++;
      const validItem: PYQQuestion = {
        ...item,
        id: item.id ? String(item.id) : `pyq-${Date.now()}-${idx}`,
        year: Number(item.year),
        options: Array.isArray(item.options) ? item.options.map(String) : [],
        correctAnswerIndex: item.correctAnswerIndex !== undefined ? Number(item.correctAnswerIndex) : 0,
      };
      validQuestions.push(validItem);

      if (item.year) yearsSet.add(Number(item.year));
      if (item.exam) examsSet.add(String(item.exam));
      if (item.subject) subjectsSet.add(String(item.subject));
    }
  });

  if (invalidItems > 20) {
    fieldErrors.push(`... and ${invalidItems - 20} more invalid question items with schema errors.`);
  }

  return {
    isValid: validItems > 0 && invalidItems === 0,
    totalItems,
    validItems,
    invalidItems,
    yearsDetected: Array.from(yearsSet).sort((a, b) => b - a),
    examsDetected: Array.from(examsSet),
    subjectsDetected: Array.from(subjectsSet),
    fieldErrors,
    typeErrors,
    validQuestions,
    samplePreview: validQuestions[0] || (parsedData[0] as PYQQuestion) || null,
  };
};

interface AdminPortalProps {
  theme: NexoraTheme;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'import' | 'pyq' | 'formula' | 'resource'>('matrix');
  const [importTarget, setImportTarget] = useState<'pyq' | 'formula'>('pyq');
  const [jsonInput, setJsonInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Datasets loaded from storage
  const [pyqList, setPyqList] = useState<PYQQuestion[]>(StorageService.getPyqs());
  const [formulaList, setFormulaList] = useState<FormulaItem[]>(StorageService.getFormulas());
  const [resourceList, setResourceList] = useState<ReferenceResource[]>(StorageService.getReferenceResources());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState<string>('All');

  // Single Question Creator / Editor Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPyq, setEditingPyq] = useState<Partial<PYQQuestion>>({
    exam: 'JEE Main',
    year: 2026,
    session: 'Session 1 Shift 1',
    subject: 'Physics',
    chapter: 'Current Electricity',
    topic: 'Ohm’s Law',
    questionType: 'MCQ_SINGLE',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
    difficulty: 'Medium',
    source: 'Admin Uploaded Dataset',
    licenseStatus: 'Admin Uploaded',
  });

  const [mergeStrategy, setMergeStrategy] = useState<'skip_duplicates' | 'overwrite' | 'append'>('skip_duplicates');
  const [validationReport, setValidationReport] = useState<PYQValidationReport | null>(null);

  const savePyqDataset = (newList: PYQQuestion[]) => {
    setPyqList(newList);
    StorageService.savePyqs(newList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        validateAndAnalyzeJson(content);
      }
    };
    reader.readAsText(file);
  };

  const validateAndAnalyzeJson = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const report = validatePyqDataset(parsed);
      setValidationReport(report);

      if (report.validItems > 0) {
        setStatusMsg({
          type: 'success',
          text: `Schema Analysis Complete: Found ${report.validItems} valid PYQ question objects out of ${report.totalItems} total (${report.invalidItems} invalid/skipped).`,
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: `Validation Failed: 0 items passed required PYQ schema and data type checks.`,
        });
      }
    } catch (err: any) {
      setValidationReport(null);
      setStatusMsg({ type: 'error', text: `JSON Syntax Error: ${err.message}` });
    }
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const report = validatePyqDataset(parsed);
      setValidationReport(report);

      if (report.validQuestions.length === 0) {
        setStatusMsg({
          type: 'error',
          text: 'Cannot import: No valid question objects passed required field and data type checks.',
        });
        return;
      }

      if (importTarget === 'pyq' || activeTab === 'import' || activeTab === 'pyq' || activeTab === 'matrix') {
        let updated: PYQQuestion[] = [];
        const existingIds = new Set(pyqList.map((p) => p.id));
        const validIncoming = report.validQuestions;

        if (mergeStrategy === 'skip_duplicates') {
          const newOnly = validIncoming.filter((item) => !existingIds.has(item.id));
          updated = [...pyqList, ...newOnly];
        } else if (mergeStrategy === 'overwrite') {
          const incomingMap = new Map(validIncoming.map((item) => [item.id, item]));
          const keptExisting = pyqList.map((p) => incomingMap.get(p.id) || p);
          const brandNew = validIncoming.filter((item) => !existingIds.has(item.id));
          updated = [...keptExisting, ...brandNew];
        } else {
          // append with newly generated unique IDs if colliding
          const sanitizedNew = validIncoming.map((item, idx) => ({
            ...item,
            id: existingIds.has(item.id) ? `${item.id}-import-${Date.now()}-${idx}` : item.id || `pyq-${Date.now()}-${idx}`,
          }));
          updated = [...pyqList, ...sanitizedNew];
        }

        savePyqDataset(updated);
        setStatusMsg({
          type: 'success',
          text: `Successfully imported ${validIncoming.length} validated PYQs into persistent storage using '${mergeStrategy}' strategy. Total stored: ${updated.length} questions.`,
        });
      } else if (importTarget === 'formula' || activeTab === 'formula') {
        const updated = [...parsed, ...formulaList];
        setFormulaList(updated);
        StorageService.saveFormulas(updated);
        setStatusMsg({ type: 'success', text: `Successfully imported ${parsed.length} formulas into vault.` });
      }

      setJsonInput('');
      setValidationReport(null);
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: `Invalid JSON syntax: ${e.message}` });
    }
  };

  const handleDownloadSchemaTemplate = () => {
    const templateSchema = [
      {
        id: "pyq-2026-jee-p1",
        exam: "JEE Main",
        year: 2026,
        session: "Session 1 Shift 1",
        subject: "Physics",
        chapter: "Current Electricity",
        topic: "Drift Velocity & Ohm's Law",
        questionType: "MCQ_SINGLE",
        questionText: "A copper wire of cross-sectional area 2.0 mm² carries a steady current of 3.2 A. If the free electron density is 8.0 x 10²⁸ m⁻³, calculate the drift velocity of free electrons.",
        options: ["0.125 mm/s", "0.250 mm/s", "0.500 mm/s", "1.00 mm/s"],
        correctAnswerIndex: 0,
        explanation: "Using I = n * e * A * v_d => v_d = I / (n * e * A) = 3.2 / (8e28 * 1.6e-19 * 2e-6) = 0.125 x 10⁻³ m/s = 0.125 mm/s.",
        conceptTested: "Drift Velocity Formula",
        difficulty: "Medium",
        timeLimitSeconds: 120,
        source: "Official NTA JEE Main 2026",
        licenseStatus: "Official Exam Record"
      },
      {
        id: "pyq-2025-neet-p1",
        exam: "NEET",
        year: 2025,
        session: "Main Paper",
        subject: "Biology",
        chapter: "Genetics and Evolution",
        topic: "Mendelian Inheritance",
        questionType: "MCQ_SINGLE",
        questionText: "In a dihybrid cross between two heterozygous plants (TtYy x TtYy), what fraction of offspring will exhibit the dominant phenotype for both traits?",
        options: ["9/16", "3/16", "1/16", "1/4"],
        correctAnswerIndex: 0,
        explanation: "According to Mendel's Law of Independent Assortment, phenotypic ratio is 9:3:3:1. Double dominant phenotype is 9/16.",
        conceptTested: "Dihybrid Cross Phenotypic Ratio",
        difficulty: "Easy",
        timeLimitSeconds: 60,
        source: "Official NTA NEET 2025",
        licenseStatus: "Official Exam Record"
      }
    ];

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateSchema, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexora_pyq_import_template.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeletePyq = (id: string) => {
    const updated = pyqList.filter((p) => p.id !== id);
    savePyqDataset(updated);
    setStatusMsg({ type: 'success', text: 'Question removed from database.' });
  };

  const handleSaveSinglePyq = () => {
    if (!editingPyq.questionText || !editingPyq.chapter) {
      setStatusMsg({ type: 'error', text: 'Question text and Chapter are required.' });
      return;
    }

    const questionToSave: PYQQuestion = {
      id: editingPyq.id || `pyq-admin-${Date.now()}`,
      exam: (editingPyq.exam as any) || 'JEE Main',
      year: Number(editingPyq.year) || 2026,
      session: editingPyq.session || 'Main Shift 1',
      paper: editingPyq.paper,
      subject: (editingPyq.subject as any) || 'Physics',
      category: editingPyq.category,
      chapter: editingPyq.chapter || 'General',
      topic: editingPyq.topic || 'General',
      questionType: (editingPyq.questionType as QuestionType) || 'MCQ_SINGLE',
      questionText: editingPyq.questionText || '',
      options: editingPyq.options || ['A', 'B', 'C', 'D'],
      correctAnswerIndex: editingPyq.correctAnswerIndex ?? 0,
      numericalAnswer: editingPyq.numericalAnswer,
      explanation: editingPyq.explanation || 'Step-by-step solution.',
      conceptTested: editingPyq.conceptTested || 'Core Concept',
      difficulty: (editingPyq.difficulty as any) || 'Medium',
      timeLimitSeconds: editingPyq.timeLimitSeconds || 120,
      source: editingPyq.source || 'Admin Uploaded',
      licenseStatus: (editingPyq.licenseStatus as any) || 'Admin Uploaded',
      formulasUsed: editingPyq.formulasUsed || [],
    };

    let updated: PYQQuestion[];
    if (editingPyq.id) {
      updated = pyqList.map((p) => (p.id === questionToSave.id ? questionToSave : p));
    } else {
      updated = [questionToSave, ...pyqList];
    }

    savePyqDataset(updated);
    setIsModalOpen(false);
    setStatusMsg({ type: 'success', text: `Question saved successfully!` });
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pyqList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexora_pyq_database_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Matrix calculations (2016 to 2026)
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
  const getCount = (exam: string, year: number, subject?: string) => {
    return pyqList.filter((q) => {
      if (q.exam !== exam) return false;
      if (q.year !== year) return false;
      if (subject && q.subject !== subject) return false;
      return true;
    }).length;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">NEXORA PYQ Data Manager</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Data Operations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bulk import, manage completeness matrices, and edit legally compliant past year question banks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 flex-wrap">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Completeness Matrix
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import Manager
          </button>
          <button
            onClick={() => setActiveTab('pyq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pyq'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            PYQ Database ({pyqList.length})
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'formula'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Formulas ({formulaList.length})
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MATRIX TAB: COMPLETENESS DASHBOARD */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  DATABASE COMPLETENESS DASHBOARD (2016–2026)
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time imported question counts. Shows exact records present in database without fake counters.
                </p>
              </div>

              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center gap-2 hover:bg-cyan-950 transition-all"
              >
                <Download className="w-4 h-4" />
                Export Database JSON
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="text-xs text-cyan-400 font-bold">JEE MAIN TOTAL</div>
                <div className="text-2xl font-black text-white">
                  {pyqList.filter((q) => q.exam === 'JEE Main').length} PYQs
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <div className="text-xs text-purple-400 font-bold">JEE ADVANCED TOTAL</div>
                <div className="text-2xl font-black text-white">
                  {pyqList.filter((q) => q.exam === 'JEE Advanced').length} PYQs
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-xs text-emerald-400 font-bold">NEET TOTAL</div>
                <div className="text-2xl font-black text-white">
                  {pyqList.filter((q) => q.exam === 'NEET').length} PYQs
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">JEE Main Total</th>
                    <th className="py-3 px-3">JEE Adv Total</th>
                    <th className="py-3 px-3">NEET Total</th>
                    <th className="py-3 px-3">Physics</th>
                    <th className="py-3 px-3">Chemistry</th>
                    <th className="py-3 px-3">Mathematics</th>
                    <th className="py-3 px-3">Biology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {years.map((y) => {
                    const jm = getCount('JEE Main', y);
                    const ja = getCount('JEE Advanced', y);
                    const neet = getCount('NEET', y);
                    const phy = pyqList.filter((q) => q.year === y && q.subject === 'Physics').length;
                    const chem = pyqList.filter((q) => q.year === y && q.subject === 'Chemistry').length;
                    const math = pyqList.filter((q) => q.year === y && q.subject === 'Mathematics').length;
                    const bio = pyqList.filter((q) => q.year === y && q.subject === 'Biology').length;

                    return (
                      <tr key={y} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-bold text-white font-sans">{y}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${jm > 0 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-500'}`}>
                            {jm} questions
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ja > 0 ? 'bg-purple-950 text-purple-300 border border-purple-500/30' : 'text-slate-500'}`}>
                            {ja} questions
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${neet > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'text-slate-500'}`}>
                            {neet} questions
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{phy}</td>
                        <td className="py-2.5 px-3 text-slate-300">{chem}</td>
                        <td className="py-2.5 px-3 text-slate-300">{math}</td>
                        <td className="py-2.5 px-3 text-slate-300">{bio}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MANAGER TAB */}
      {activeTab === 'import' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                PYQ Dataset & Schema Import Manager
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload JSON-formatted past year question datasets with real-time schema field validation. Verifies required schema attributes before bulk-updating local state and persistent storage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSchemaTemplate}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-cyan-500/20 transition-all shadow-md"
                title="Download standard 2016-2026 schema format template"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                Schema Template JSON
              </button>
            </div>
          </div>

          {/* Target Dataset & Merge Strategy Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                1. Upload Dataset File (.json)
              </label>
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/70 cursor-pointer transition-all group">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                  Click to select file or drag & drop JSON PYQ dataset
                </span>
                <span className="text-[11px] text-slate-500 mt-1 text-center">
                  Required fields: <code className="text-cyan-400 font-mono">questionText</code>, <code className="text-cyan-400 font-mono">exam</code>, <code className="text-cyan-400 font-mono">year</code>, <code className="text-cyan-400 font-mono">subject</code>, <code className="text-cyan-400 font-mono">chapter</code>, <code className="text-cyan-400 font-mono">questionType</code>
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  Target & Merge Configuration
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Target Storage Collection</label>
                    <select
                      value={importTarget}
                      onChange={(e) => setImportTarget(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="pyq">PYQ Questions Bank ({pyqList.length} items)</option>
                      <option value="formula">Formula Vault ({formulaList.length} items)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Duplicate Handling Strategy</label>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="merge"
                          checked={mergeStrategy === 'skip_duplicates'}
                          onChange={() => setMergeStrategy('skip_duplicates')}
                          className="accent-cyan-400"
                        />
                        <span>Skip Duplicates (Keep Existing)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="merge"
                          checked={mergeStrategy === 'overwrite'}
                          onChange={() => setMergeStrategy('overwrite')}
                          className="accent-cyan-400"
                        />
                        <span>Overwrite Existing Records</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="merge"
                          checked={mergeStrategy === 'append'}
                          onChange={() => setMergeStrategy('append')}
                          className="accent-cyan-400"
                        />
                        <span>Append All (Generate Unique IDs)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Area Raw Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                2. Direct Raw JSON Dataset Input
              </span>
              <button
                onClick={() => validateAndAnalyzeJson(jsonInput)}
                disabled={!jsonInput.trim()}
                className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-900 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Dry-Run Schema Validation Check
              </button>
            </div>
            <textarea
              rows={4}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                if (validationReport) setValidationReport(null);
              }}
              placeholder={`Paste JSON array of PYQ items here or upload a file above...\n[\n  {\n    "id": "pyq-2026-p1",\n    "exam": "JEE Main",\n    "year": 2026,\n    "session": "Session 1 Shift 1",\n    "subject": "Physics",\n    "chapter": "Current Electricity",\n    "questionType": "MCQ_SINGLE",\n    "questionText": "A copper wire of cross-sectional area...",\n    "options": ["0.125 mm/s", "0.250 mm/s", "0.500 mm/s", "1.00 mm/s"],\n    "correctAnswerIndex": 0,\n    "explanation": "Using I = n e A v_d...",\n    "source": "Official NTA JEE Main 2026"\n  }\n]`}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* Dry-run Validation Report Card */}
          {validationReport && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Dry-Run Schema Validation Report
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {validationReport.validItems} / {validationReport.totalItems} Objects Valid
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">EXAMS DETECTED</span>
                  <span className="font-bold text-white">
                    {validationReport.examsDetected.join(', ') || 'None'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">YEAR RANGE</span>
                  <span className="font-bold text-cyan-300">
                    {validationReport.yearsDetected.length > 0
                      ? `${Math.min(...validationReport.yearsDetected)} - ${Math.max(...validationReport.yearsDetected)}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">VALID SCHEMA ITEMS</span>
                  <span className="font-bold text-emerald-400">{validationReport.validItems}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">INVALID / SKIPPED</span>
                  <span className="font-bold text-rose-400">{validationReport.invalidItems}</span>
                </div>
              </div>

              {validationReport.fieldErrors && validationReport.fieldErrors.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1.5">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    Missing Required Schema Fields ({validationReport.fieldErrors.length} notices):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-200 font-mono text-[11px] max-h-32 overflow-y-auto">
                    {validationReport.fieldErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationReport.typeErrors && validationReport.typeErrors.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    Incorrect Data Types / Formatting Flags ({validationReport.typeErrors.length} notices):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-200 font-mono text-[11px] max-h-32 overflow-y-auto">
                    {validationReport.typeErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationReport.samplePreview && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 block mb-1">First Valid Record Preview:</span>
                  <p className="font-mono text-cyan-300 line-clamp-2">
                    [{validationReport.samplePreview.exam} {validationReport.samplePreview.year}] {validationReport.samplePreview.subject} - {validationReport.samplePreview.chapter}: {validationReport.samplePreview.questionText}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setJsonInput('');
                setValidationReport(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
            >
              Clear Input
            </button>
            <button
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Database className="w-4 h-4" />
              Commit Bulk Ingest
            </button>
          </div>
        </div>
      )}

      {/* QUESTION CATALOG & SINGLE EDITOR */}
      {activeTab === 'pyq' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Active PYQ Catalog ({pyqList.length})
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="All">All Exams</option>
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions or chapters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setEditingPyq({
                    exam: 'JEE Main',
                    year: 2026,
                    session: 'Session 1 Shift 1',
                    subject: 'Physics',
                    chapter: '',
                    topic: '',
                    questionType: 'MCQ_SINGLE',
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswerIndex: 0,
                    explanation: '',
                    difficulty: 'Medium',
                    source: 'Admin Uploaded',
                    licenseStatus: 'Admin Uploaded',
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {pyqList
              .filter((q) => {
                if (filterExam !== 'All' && q.exam !== filterExam) return false;
                if (
                  searchTerm &&
                  !q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !q.chapter.toLowerCase().includes(searchTerm.toLowerCase())
                )
                  return false;
                return true;
              })
              .map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start justify-between gap-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase">
                        {q.exam} {q.year}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-bold">
                        {q.session || 'Shift 1'}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {q.subject} • {q.chapter}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono">
                        {q.licenseStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2">{q.questionText}</p>
                    <div className="text-[10px] text-slate-500">Source: {q.source}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingPyq(q);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePyq(q.id)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-400 border border-rose-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SINGLE QUESTION CREATOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-2xl w-full space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                {editingPyq.id ? 'Edit Question Record' : 'Create New PYQ Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Exam</label>
                <select
                  value={editingPyq.exam}
                  onChange={(e) => setEditingPyq({ ...editingPyq, exam: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Year (2016 - 2026)</label>
                <input
                  type="number"
                  value={editingPyq.year}
                  onChange={(e) => setEditingPyq({ ...editingPyq, year: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Session / Shift / Paper</label>
                <input
                  type="text"
                  value={editingPyq.session}
                  onChange={(e) => setEditingPyq({ ...editingPyq, session: e.target.value })}
                  placeholder="e.g. Session 1 Shift 1 or Paper 1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Subject</label>
                <select
                  value={editingPyq.subject}
                  onChange={(e) => setEditingPyq({ ...editingPyq, subject: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Chapter</label>
                <input
                  type="text"
                  value={editingPyq.chapter}
                  onChange={(e) => setEditingPyq({ ...editingPyq, chapter: e.target.value })}
                  placeholder="e.g. Current Electricity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Question Type</label>
                <select
                  value={editingPyq.questionType}
                  onChange={(e) => setEditingPyq({ ...editingPyq, questionType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="MCQ_SINGLE">MCQ Single Correct</option>
                  <option value="MCQ_MULTIPLE">MCQ Multiple Correct</option>
                  <option value="NUMERICAL">Numerical Answer</option>
                  <option value="MATCH">Matrix Match</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-400 font-bold">Question Text</label>
              <textarea
                rows={3}
                value={editingPyq.questionText}
                onChange={(e) => setEditingPyq({ ...editingPyq, questionText: e.target.value })}
                placeholder="Enter complete question statement..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            {editingPyq.questionType !== 'NUMERICAL' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(editingPyq.options || ['', '', '', '']).map((opt, idx) => (
                  <div key={idx}>
                    <label className="block text-slate-400 text-[10px]">Option {idx + 1}</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...(editingPyq.options || ['', '', '', ''])];
                        opts[idx] = e.target.value;
                        setEditingPyq({ ...editingPyq, options: opts });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs">
                <label className="block text-slate-400 font-bold mb-1">Exact / Range Numerical Answer</label>
                <input
                  type="text"
                  value={editingPyq.numericalAnswerText || ''}
                  onChange={(e) => setEditingPyq({ ...editingPyq, numericalAnswerText: e.target.value })}
                  placeholder="e.g. 1.07"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs text-slate-400 font-bold">Detailed Explanation</label>
              <textarea
                rows={2}
                value={editingPyq.explanation}
                onChange={(e) => setEditingPyq({ ...editingPyq, explanation: e.target.value })}
                placeholder="Step by step solution..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Source Record</label>
                <input
                  type="text"
                  value={editingPyq.source}
                  onChange={(e) => setEditingPyq({ ...editingPyq, source: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">License / Origin</label>
                <select
                  value={editingPyq.licenseStatus}
                  onChange={(e) => setEditingPyq({ ...editingPyq, licenseStatus: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                >
                  <option value="Official Exam Record">Official Exam Record</option>
                  <option value="Public Educational Resource">Public Educational Resource</option>
                  <option value="Admin Uploaded">Admin Uploaded</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSinglePyq}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
