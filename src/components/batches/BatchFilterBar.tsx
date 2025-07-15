import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Download } from 'lucide-react';
import { useLookups } from '@/hooks/useLookups';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  mode: string;
  onModeChange: (v: string) => void;
  course: string;
  onCourseChange: (v: string) => void;
  onRefresh?: () => void;
}

const BatchFilterBar = ({search,onSearchChange,status,onStatusChange,mode,onModeChange,course,onCourseChange,onRefresh}:Props)=>{
  const { lookups } = useLookups();
  const mapValue=(v:string)=> v==='all'? '': v;
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
        <Input value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search batches..." className="pl-10 glass border-white/20"/>
      </div>
      <Select value={status||'all'} onValueChange={v=>onStatusChange(mapValue(v))}>
        <SelectTrigger className="glass border-white/20 min-w-[100px]">
          <SelectValue placeholder="Status"/>
        </SelectTrigger>
        <SelectContent className="glass bg-background border-white/20">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={mode||'all'} onValueChange={v=>onModeChange(mapValue(v))}>
        <SelectTrigger className="glass border-white/20 min-w-[100px]">
          <SelectValue placeholder="Mode"/>
        </SelectTrigger>
        <SelectContent className="glass bg-background border-white/20">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>
      <Select value={course||'all'} onValueChange={v=>onCourseChange(mapValue(v))}>
        <SelectTrigger className="glass border-white/20 w-40">
          <SelectValue placeholder="Course"/>
        </SelectTrigger>
        <SelectContent className="glass bg-background border-white/20 max-h-60 overflow-y-auto">
          <SelectItem value="all">All</SelectItem>
          {lookups.courses?.map(c=> <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="flex gap-2 ml-auto mt-2 md:mt-0">
        {onRefresh && (
          <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10" disabled>
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
export default BatchFilterBar; 