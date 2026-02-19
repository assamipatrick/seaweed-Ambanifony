

import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { useSettings } from '../contexts/SettingsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Select from '../components/ui/Select';
import { formatNumber } from '../utils/formatters';
import type { CultivationCycle, Module, SeaweedType, Site } from '../types';
import { exportDataToExcel } from '../utils/excelExporter';
import EditCuttingRecordModal from '../components/EditCuttingRecordModal';
import Input from '../components/ui/Input';

interface CuttingInfo {
    cycle: CultivationCycle;
    module?: Module;
    site?: Site;
    seaweedType?: SeaweedType;
}

type SortableKeys = 'date' | 'seaweedTypeName' | 'quantity' | 'moduleCode' | 'siteName';

const CuttingsLedger: React.FC = () => {
    const { t } = useLocalization();
    const { settings } = useSettings();
    const { cultivationCycles, modules, seaweedTypes, sites, updateCultivationCycle } = useData();

    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });
    const [filters, setFilters] = useState({ moduleCode: '', seaweedTypeId: 'all', startDate: '', endDate: '' });

    const [editingCycle, setEditingCycle] = useState<CultivationCycle | null>(null);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    const clearFilters = useCallback(() => {
        setFilters({ moduleCode: '', seaweedTypeId: 'all', startDate: '', endDate: '' });
    }, []);

    const cuttingsData = useMemo((): CuttingInfo[] => {
        let data = cultivationCycles
            .filter(c => c.cuttingsTakenAtHarvestKg && c.cuttingsTakenAtHarvestKg > 0 && c.harvestDate)
            .map(cycle => {
                const module = modules.find(m => m.id === cycle.moduleId);
                return {
                    cycle,
                    module,
                    site: module ? sites.find(s => s.id === module.siteId) : undefined,
                    seaweedType: seaweedTypes.find(st => st.id === cycle.seaweedTypeId),
                };
            });
        
        if (filters.seaweedTypeId !== 'all') {
            data = data.filter(item => item.cycle.seaweedTypeId === filters.seaweedTypeId);
        }
        if (filters.moduleCode.trim()) {
            data = data.filter(item => item.module?.code.toLowerCase().includes(filters.moduleCode.trim().toLowerCase()));
        }
        if (filters.startDate) {
            data = data.filter(item => item.cycle.harvestDate! >= filters.startDate);
        }
        if (filters.endDate) {
            data = data.filter(item => item.cycle.harvestDate! <= filters.endDate);
        }
        
        data.sort((a, b) => {
            let valA: string | number, valB: string | number;
            switch(sortConfig.key) {
                case 'date':
                    valA = a.cycle.harvestDate || '';
                    valB = b.cycle.harvestDate || '';
                    break;
                case 'seaweedTypeName':
                    valA = a.seaweedType?.name || '';
                    valB = b.seaweedType?.name || '';
                    break;
                case 'quantity':
                    valA = a.cycle.cuttingsTakenAtHarvestKg || 0;
                    valB = b.cycle.cuttingsTakenAtHarvestKg || 0;
                    break;
                case 'moduleCode':
                    valA = a.module?.code || '';
                    valB = b.module?.code || '';
                    break;
                case 'siteName':
                    valA = a.site?.name || '';
                    valB = b.site?.name || '';
                    break;
                default:
                    valA = ''; valB = '';
            }

            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });

        return data;

    }, [cultivationCycles, modules, sites, seaweedTypes, filters, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) return <Icon name="ChevronDown" className="w-4 h-4 text-transparent group-hover:text-gray-400" />;
        return sortConfig.direction === 'ascending' ? <Icon name="ArrowUp" className="w-4 h-4" /> : <Icon name="ArrowDown" className="w-4 h-4" />;
    };

    const SortableHeader: React.FC<{ sortKey: SortableKeys; label: string; className?: string }> = ({ sortKey, label, className = '' }) => (
        <th className={`p-3 ${className}`}>
            <button onClick={() => requestSort(sortKey)} className={`group flex items-center gap-2 w-full ${className.includes('text-right') ? 'justify-end' : ''}`}>
                {label} {getSortIcon(sortKey)}
            </button>
        </th>
    );

    const handleExportExcel = async () => {
        const dataToExport = cuttingsData.map(info => ({
            date: info.cycle.harvestDate,
            seaweedType: info.seaweedType?.name || '',
            quantityKg: info.cycle.cuttingsTakenAtHarvestKg,
            sourceModule: info.module?.code || '',
            sourceSite: info.site?.name || '',
            intendedUse: info.cycle.cuttingsIntendedUse || ''
        }));

        const columns = [
            { header: t('dateTaken'), key: 'date', width: 20 },
            { header: t('seaweedType'), key: 'seaweedType', width: 25 },
            { header: t('cuttingsQuantityKg'), key: 'quantityKg', width: 15 },
            { header: t('sourceModule'), key: 'sourceModule', width: 20 },
            { header: t('sourceSite'), key: 'sourceSite', width: 20 },
            { header: t('cuttingsIntendedUse'), key: 'intendedUse', width: 40 },
        ];

        await exportDataToExcel(dataToExport, columns, 'CuttingsLedger', 'Cuttings');
    };

    const handleOpenEditModal = (cycle: CultivationCycle) => {
        setEditingCycle(cycle);
    };

    const handleSaveEdit = (updatedCycle: CultivationCycle) => {
        updateCultivationCycle(updatedCycle);
        setEditingCycle(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">{t('cuttingsLedgerTitle')}</h1>
                <Button onClick={handleExportExcel} variant="secondary">
                    <Icon name="FileSpreadsheet" className="w-5 h-5 mr-2" />
                    {t('exportExcel')}
                </Button>
            </div>


            <Card className="mb-6" title={t('filtersTitle')}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Select label={t('seaweedType')} value={filters.seaweedTypeId} onChange={e => handleFilterChange('seaweedTypeId', e.target.value)}>
                        <option value="all">{t('allSeaweedTypes')}</option>
                        {seaweedTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                    </Select>
                    <Input label={t('searchByModule')} value={filters.moduleCode} onChange={e => handleFilterChange('moduleCode', e.target.value)} />
                    <Input label={t('startDate')} type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} />
                    <Input label={t('endDate')} type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} />
                    <Button variant="secondary" onClick={clearFilters} className="h-[42px] w-full">{t('clearFilters')}</Button>
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <SortableHeader sortKey="date" label={t('dateTaken')} />
                                <SortableHeader sortKey="seaweedTypeName" label={t('seaweedType')} />
                                <SortableHeader sortKey="quantity" label={t('cuttingsQuantityKg')} className="text-right" />
                                <SortableHeader sortKey="moduleCode" label={t('sourceModule')} />
                                <SortableHeader sortKey="siteName" label={t('sourceSite')} />
                                <th className="p-3">{t('cuttingsIntendedUse')}</th>
                                <th className="p-3 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuttingsData.map(({ cycle, module, site, seaweedType }) => (
                                <tr key={cycle.id} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                    <td className="p-3">{cycle.harvestDate}</td>
                                    <td className="p-3 font-semibold">{seaweedType?.name || t('unknown')}</td>
                                    <td className="p-3 text-right">{formatNumber(cycle.cuttingsTakenAtHarvestKg || 0, settings.localization)}</td>
                                    <td className="p-3 font-mono">{module?.code || t('unknown')}</td>
                                    <td className="p-3">{site?.name || t('unknown')}</td>
                                    <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{cycle.cuttingsIntendedUse || '-'}</td>
                                    <td className="p-3 text-right">
                                        <Button variant="ghost" onClick={() => handleOpenEditModal(cycle)}>
                                            <Icon name="Edit2" className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {cuttingsData.length === 0 && (
                                <tr><td colSpan={7} className="text-center p-8 text-gray-500 italic">{t('noCuttingsData')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            {editingCycle && (
                <EditCuttingRecordModal
                    isOpen={!!editingCycle}
                    onClose={() => setEditingCycle(null)}
                    cycle={editingCycle}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default CuttingsLedger;