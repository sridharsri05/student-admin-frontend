import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { useState } from 'react';
import EditBatchModal from './EditBatchModal';
import BatchStudentsModal from './BatchStudentsModal';

const statusColor=(s)=>{
 switch(s){
   case 'active':return 'bg-neon-green/20 text-neon-green';
   case 'upcoming':return 'bg-neon-cyan/20 text-neon-cyan';
   case 'completed':return 'bg-gray-500/20 text-gray-400';
   case 'cancelled':return 'bg-red-500/20 text-red-400';
   default:return 'bg-gray-500/20 text-gray-400';
 }
};

const getCourseName=(c:any)=> typeof c==='object'&&c? c.name: c;

export default function BatchListTable({batches}){
  const { updateBatch, deleteBatch, fetchBatches } = useBatches();
  const [editing,setEditing]=useState(null);
  const [manageId,setManageId]=useState(null);

  const handleDelete=async(id)=>{
    if(confirm('Delete batch?')){
      await deleteBatch(id);
      fetchBatches();
    }
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map(b=> (
            <TableRow key={b._id} className="hover:bg-white/5">
              <TableCell>{b.name}</TableCell>
              <TableCell>{getCourseName(b.course)}</TableCell>
              <TableCell>{new Date(b.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(b.endDate).toLocaleDateString()}</TableCell>
              <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="outline" onClick={()=>setEditing(b)}><Edit className="w-4 h-4"/></Button>
                  <Button size="icon" variant="outline" onClick={()=>handleDelete(b._id)}><Trash2 className="w-4 h-4"/></Button>
                  <Button size="sm" variant="outline" onClick={()=>setManageId(b._id)}>Students</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && <EditBatchModal batch={editing} onSave={async(p)=>{await updateBatch(editing._id,p); fetchBatches(); setEditing(null);}} onClose={()=>setEditing(null)}/>}
      {manageId && <BatchStudentsModal batchId={manageId} open={!!manageId} onClose={()=>setManageId(null)}/>}
    </div>
  );
} 