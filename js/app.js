
let laptops=[
  {id:1,brand:'Dell',model:'Latitude 5520',serial:'SN-DELL-001',specs:'Intel i5-11th Gen, 16GB RAM, 512GB SSD',purchase:'2022-01-15',warranty:'2025-01-15',status:'In Use',assignedTo:'Juan dela Cruz',dept:'IT Department',assignedDate:'2022-02-01',notes:'Good condition',deleted:false,created:'2022-01-15'},
  {id:2,brand:'HP',model:'EliteBook 840 G8',serial:'SN-HP-002',specs:'Intel i7-11th Gen, 16GB RAM, 256GB SSD',purchase:'2022-03-10',warranty:'2025-03-10',status:'Available',assignedTo:'',dept:'',assignedDate:'',notes:'Ready for assignment',deleted:false,created:'2022-03-10'},
  {id:3,brand:'Lenovo',model:'ThinkPad X1 Carbon',serial:'SN-LEN-003',specs:'Intel i7-12th Gen, 32GB RAM, 1TB SSD',purchase:'2023-05-20',warranty:'2026-05-20',status:'In Use',assignedTo:'Maria Santos',dept:'Finance',assignedDate:'2023-06-01',notes:'',deleted:false,created:'2023-05-20'},
  {id:4,brand:'Apple',model:'MacBook Pro 14',serial:'SN-APL-004',specs:'Apple M2 Pro, 16GB RAM, 512GB SSD',purchase:'2023-08-01',warranty:'2026-08-01',status:'In Use',assignedTo:'Pedro Reyes',dept:'Marketing',assignedDate:'2023-08-15',notes:'For design team',deleted:false,created:'2023-08-01'},
  {id:5,brand:'Dell',model:'Inspiron 15',serial:'SN-DELL-005',specs:'Intel i5-10th Gen, 8GB RAM, 256GB SSD',purchase:'2021-06-12',warranty:'2024-06-12',status:'Under Repair',assignedTo:'',dept:'',assignedDate:'',notes:'Screen replacement',deleted:false,created:'2021-06-12'},
  {id:6,brand:'Asus',model:'ZenBook 14',serial:'SN-ASUS-006',specs:'AMD Ryzen 5, 16GB RAM, 512GB SSD',purchase:'2022-11-30',warranty:'2025-11-30',status:'Available',assignedTo:'',dept:'',assignedDate:'',notes:'',deleted:false,created:'2022-11-30'},
  {id:7,brand:'HP',model:'ProBook 450 G9',serial:'SN-HP-007',specs:'Intel i5-12th Gen, 8GB RAM, 512GB SSD',purchase:'2023-01-05',warranty:'2026-01-05',status:'In Use',assignedTo:'Ana Gonzales',dept:'HR Department',assignedDate:'2023-02-01',notes:'',deleted:false,created:'2023-01-05'},
  {id:8,brand:'Lenovo',model:'IdeaPad 5',serial:'SN-LEN-008',specs:'AMD Ryzen 7, 16GB RAM, 512GB SSD',purchase:'2021-09-15',warranty:'2024-09-15',status:'Retired',assignedTo:'',dept:'',assignedDate:'',notes:'End of life',deleted:false,created:'2021-09-15'},
];
let assignHistory=[
  {lid:1,to:'Juan dela Cruz',dept:'IT Department',from:'2022-02-01',ret:null},
  {lid:3,to:'Maria Santos',dept:'Finance',from:'2023-06-01',ret:null},
  {lid:4,to:'Pedro Reyes',dept:'Marketing',from:'2023-08-15',ret:null},
  {lid:7,to:'Ana Gonzales',dept:'HR Department',from:'2023-02-01',ret:null},
  {lid:8,to:'Jose Bautista',dept:'Operations',from:'2021-10-01',ret:'2023-04-01'},
];
let auditLog=[
  {lid:1,action:'Created',by:'Admin',at:'2022-01-15 09:00',remarks:'Initial record'},
  {lid:3,action:'Created',by:'Admin',at:'2023-05-20 10:30',remarks:'New purchase'},
  {lid:4,action:'Updated',by:'Admin',at:'2023-08-15 14:00',remarks:'Assigned to Marketing'},
  {lid:5,action:'Updated',by:'Admin',at:'2024-02-01 08:45',remarks:'Status changed to Under Repair'},
  {lid:8,action:'Updated',by:'Admin',at:'2024-01-10 11:00',remarks:'Marked as Retired'},
];
let nextId=9, currentLaptopId=null;

function badgeClass(s){return{Available:'badge-available','In Use':'badge-inuse','Under Repair':'badge-repair',Retired:'badge-retired'}[s]||'';}
function badge(s){return`<span class="badge ${badgeClass(s)}">${s}</span>`;}
function fmtD(d){if(!d)return'—';return new Date(d).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'});}
function isExpired(w){return new Date(w)<new Date();}
function isExpiringSoon(w){const n=new Date(),s=new Date();s.setDate(n.getDate()+90);const wd=new Date(w);return wd>=n&&wd<=s;}
function wBadge(w){
  if(isExpired(w))return`<span class="badge badge-danger"><i class="fas fa-xmark"></i> Expired</span>`;
  if(isExpiringSoon(w))return`<span class="badge badge-warning"><i class="fas fa-clock"></i> Expiring Soon</span>`;
  return`<span style="color:var(--success);font-size:12px"><i class="fas fa-check"></i> ${fmtD(w)}</span>`;
}
function updateStats(){
  const a=laptops.filter(l=>!l.deleted);
  document.getElementById('s-total').textContent=a.length;
  document.getElementById('s-avail').textContent=a.filter(l=>l.status==='Available').length;
  document.getElementById('s-inuse').textContent=a.filter(l=>l.status==='In Use').length;
  document.getElementById('s-repair').textContent=a.filter(l=>l.status==='Under Repair').length;
  document.getElementById('s-retired').textContent=a.filter(l=>l.status==='Retired').length;
  document.getElementById('s-wsoon').textContent=a.filter(l=>isExpiringSoon(l.warranty)).length;
  document.getElementById('s-wexp').textContent=a.filter(l=>isExpired(l.warranty)).length;
  document.getElementById('s-trash').textContent=laptops.filter(l=>l.deleted).length;
}
function showPage(name,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  if(btn){document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));btn.classList.add('active');}
  const titles={dashboard:'Dashboard',list:'All Laptops',create:'Add New Laptop',details:'Laptop Details',edit:'Edit Laptop',history:'Assignment History',audit:'Audit Log',trash:'Trash – Deleted Laptops'};
  document.getElementById('pageTitle').textContent=titles[name]||name;
  if(name==='dashboard'){updateStats();renderDashboard();}
  if(name==='list')renderList();
  if(name==='history')renderHistory();
  if(name==='audit')renderAudit();
  if(name==='trash')renderTrash();
}
function renderDashboard(){
  document.getElementById('dash-tbody').innerHTML=laptops.filter(l=>!l.deleted).slice(0,8).map(l=>`
    <tr>
      <td><div style="font-weight:600;color:#fff">${l.brand} ${l.model}</div><div style="font-size:11px;color:var(--text-muted)">${l.specs}</div></td>
      <td><code>${l.serial}</code></td>
      <td>${badge(l.status)}</td>
      <td>${l.assignedTo?`<div style="font-size:13px">${l.assignedTo}</div><div style="font-size:11px;color:var(--text-muted)">${l.dept}</div>`:'<span style="color:var(--text-muted)">—</span>'}</td>
      <td>${wBadge(l.warranty)}</td>
      <td><div class="actions"><button class="btn btn-ghost btn-sm" onclick="openDetails(${l.id})"><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm" onclick="openEditById(${l.id})"><i class="fas fa-pen"></i></button></div></td>
    </tr>`).join('');
}
function renderList(){
  const s=(document.getElementById('searchInput')||{value:''}).value.toLowerCase();
  const sf=(document.getElementById('statusFilter')||{value:''}).value;
  const bf=(document.getElementById('brandFilter')||{value:''}).value;
  let d=laptops.filter(l=>!l.deleted);
  if(sf)d=d.filter(l=>l.status===sf);
  if(bf)d=d.filter(l=>l.brand===bf);
  if(s)d=d.filter(l=>[l.brand,l.model,l.serial,l.assignedTo,l.dept].join(' ').toLowerCase().includes(s));
  document.getElementById('listCount').textContent=`(${d.length} records)`;
  document.getElementById('list-tbody').innerHTML=d.map(l=>`
    <tr>
      <td style="color:var(--text-muted);font-size:11.5px">${l.id}</td>
      <td><div style="font-weight:600;color:#fff">${l.brand}</div><div style="font-size:11px;color:var(--text-muted)">${l.model}</div></td>
      <td><code>${l.serial}</code></td>
      <td style="font-size:11.5px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.specs}</td>
      <td>${badge(l.status)}</td>
      <td>${l.assignedTo?`<div style="font-size:12px">${l.assignedTo}</div><div style="font-size:11px;color:var(--text-muted)">${l.dept}</div>`:'<span style="color:var(--text-muted);font-size:12px">Unassigned</span>'}</td>
      <td style="font-size:11.5px">${fmtD(l.purchase)}</td>
      <td>${wBadge(l.warranty)}</td>
      <td><div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="openDetails(${l.id})"><i class="fas fa-eye"></i></button>
        <button class="btn btn-primary btn-sm" onclick="openEditById(${l.id})"><i class="fas fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="currentLaptopId=${l.id};document.getElementById('deleteModal').classList.add('open')"><i class="fas fa-trash-can"></i></button>
      </div></td>
    </tr>`).join('');
}
function openDetails(id){
  currentLaptopId=id;
  const l=laptops.find(x=>x.id===id);
  document.getElementById('det_title').textContent=`${l.brand} ${l.model}`;
  document.getElementById('det_badges').innerHTML=`<code>${l.serial}</code>${badge(l.status)}${isExpired(l.warranty)?'<span class="badge badge-danger"><i class="fas fa-shield-halved"></i> Warranty Expired</span>':''}`;
  document.getElementById('det_grid').innerHTML=`
    <div><div class="detail-key">Brand</div><div class="detail-value">${l.brand}</div></div>
    <div><div class="detail-key">Model</div><div class="detail-value">${l.model}</div></div>
    <div><div class="detail-key">Serial No.</div><div class="detail-value"><code>${l.serial}</code></div></div>
    <div><div class="detail-key">Status</div><div class="detail-value">${badge(l.status)}</div></div>
    <div><div class="detail-key">Specifications</div><div class="detail-value" style="font-size:12px">${l.specs||'—'}</div></div>
    <div><div class="detail-key">Purchase Date</div><div class="detail-value">${fmtD(l.purchase)}</div></div>
    <div><div class="detail-key">Warranty Expiry</div><div class="detail-value">${fmtD(l.warranty)}&nbsp;${wBadge(l.warranty)}</div></div>
    <div><div class="detail-key">Assigned To</div><div class="detail-value">${l.assignedTo||'—'}</div></div>
    <div><div class="detail-key">Department</div><div class="detail-value">${l.dept||'—'}</div></div>
    <div><div class="detail-key">Assigned Date</div><div class="detail-value">${fmtD(l.assignedDate)}</div></div>
    <div><div class="detail-key">Notes</div><div class="detail-value">${l.notes||'—'}</div></div>
    <div><div class="detail-key">Created</div><div class="detail-value" style="color:var(--text-muted);font-size:12px">${l.created}</div></div>
  `;
  const lh=assignHistory.filter(h=>h.lid===id);
  document.getElementById('det_hist_tbody').innerHTML=lh.length?lh.map(h=>`<tr><td style="font-weight:500">${h.to}</td><td style="color:var(--text-muted)">${h.dept||'—'}</td><td style="font-size:12px">${fmtD(h.from)}</td><td>${h.ret?`<span style="font-size:12px;color:var(--text-muted)">${fmtD(h.ret)}</span>`:'<span class="badge badge-inuse">Active</span>'}</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-muted)">No history.</td></tr>';
  const la=auditLog.filter(a=>a.lid===id);
  const am={Created:'badge-available',Updated:'badge-inuse',Deleted:'badge-danger',Restored:'badge-warning'};
  document.getElementById('det_audit_tbody').innerHTML=la.length?la.map(a=>`<tr><td><span class="badge ${am[a.action]||''}">${a.action}</span></td><td>${a.by}</td><td style="font-size:11.5px;color:var(--text-muted)">${a.at}</td><td style="font-size:12px;color:var(--text-muted)">${a.remarks||'—'}</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-muted)">No audit records.</td></tr>';
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-info').classList.add('active');
  document.querySelectorAll('.tab-btn')[0].classList.add('active');
  showPage('details',null);
}
function openEditById(id){
  currentLaptopId=id;
  const l=laptops.find(x=>x.id===id);
  ['brand','model','serial','specs','assignedTo','dept','notes'].forEach(f=>document.getElementById('e_'+f).value=l[f]||'');
  document.getElementById('e_status').value=l.status;
  document.getElementById('e_purchase').value=l.purchase;
  document.getElementById('e_warranty').value=l.warranty;
  document.getElementById('e_assignedDate').value=l.assignedDate||'';
  showPage('edit',null);
}
function saveLaptop(){
  const brand=document.getElementById('f_brand').value.trim();
  const model=document.getElementById('f_model').value.trim();
  const serial=document.getElementById('f_serial').value.trim();
  if(!brand||!model||!serial){showToast('Please fill in Brand, Model and Serial Number.','warning');return;}
  const l={id:nextId++,brand,model,serial,specs:document.getElementById('f_specs').value,purchase:document.getElementById('f_purchase').value,warranty:document.getElementById('f_warranty').value,status:document.getElementById('f_status').value,assignedTo:document.getElementById('f_assignedTo').value,dept:document.getElementById('f_dept').value,assignedDate:document.getElementById('f_assignedDate').value,notes:document.getElementById('f_notes').value,deleted:false,created:new Date().toISOString().split('T')[0]};
  laptops.unshift(l);
  auditLog.unshift({lid:l.id,action:'Created',by:'Admin',at:new Date().toLocaleString(),remarks:'New laptop added'});
  if(l.assignedTo)assignHistory.push({lid:l.id,to:l.assignedTo,dept:l.dept,from:l.assignedDate||new Date().toISOString().split('T')[0],ret:null});
  ['f_brand','f_model','f_serial','f_specs','f_assignedTo','f_dept','f_notes'].forEach(id=>document.getElementById(id).value='');
  showToast(`Laptop "${l.brand} ${l.model}" added successfully!`,'success');
  openDetails(l.id);
}
function updateLaptop(){
  const l=laptops.find(x=>x.id===currentLaptopId);
  const oldAssigned=l.assignedTo;
  ['brand','model','serial','specs','assignedTo','dept','notes'].forEach(f=>l[f]=document.getElementById('e_'+f).value);
  l.status=document.getElementById('e_status').value;
  l.purchase=document.getElementById('e_purchase').value;
  l.warranty=document.getElementById('e_warranty').value;
  l.assignedDate=document.getElementById('e_assignedDate').value;
  auditLog.unshift({lid:l.id,action:'Updated',by:'Admin',at:new Date().toLocaleString(),remarks:'Laptop info updated'});
  if(l.assignedTo&&l.assignedTo!==oldAssigned){
    assignHistory.filter(h=>h.lid===l.id&&!h.ret).forEach(h=>h.ret=new Date().toISOString().split('T')[0]);
    assignHistory.push({lid:l.id,to:l.assignedTo,dept:l.dept,from:l.assignedDate||new Date().toISOString().split('T')[0],ret:null});
  }
  showToast(`"${l.brand} ${l.model}" updated successfully!`,'success');
  openDetails(l.id);
}
function deleteLaptop(){
  const l=laptops.find(x=>x.id===currentLaptopId);
  l.deleted=true;
  auditLog.unshift({lid:l.id,action:'Deleted',by:'Admin',at:new Date().toLocaleString(),remarks:document.getElementById('deleteRemarks').value||'No reason given'});
  document.getElementById('deleteRemarks').value='';
  document.getElementById('deleteModal').classList.remove('open');
  showToast(`"${l.brand} ${l.model}" moved to Trash.`,'warning');
  showPage('list',null);
}
function restoreLaptop(id){
  const l=laptops.find(x=>x.id===id);l.deleted=false;
  auditLog.unshift({lid:l.id,action:'Restored',by:'Admin',at:new Date().toLocaleString(),remarks:'Restored from Trash'});
  showToast(`"${l.brand} ${l.model}" restored!`,'success');renderTrash();updateStats();
}
function permDeleteLaptop(id){
  if(!confirm('Permanently delete this record? This CANNOT be undone!'))return;
  laptops=laptops.filter(x=>x.id!==id);showToast('Record permanently deleted.','warning');renderTrash();
}
function renderHistory(){
  document.getElementById('history-tbody').innerHTML=assignHistory.map(h=>{
    const l=laptops.find(x=>x.id===h.lid)||{brand:'?',model:'',serial:'—'};
    return`<tr><td><div style="font-weight:500">${l.brand} ${l.model}</div></td><td><code>${l.serial}</code></td><td style="font-weight:500">${h.to}</td><td style="color:var(--text-muted);font-size:12px">${h.dept||'—'}</td><td style="font-size:12px">${fmtD(h.from)}</td><td style="font-size:12px;color:var(--text-muted)">${h.ret?fmtD(h.ret):'—'}</td><td>${h.ret?'<span class="badge badge-retired">Returned</span>':'<span class="badge badge-inuse">Active</span>'}</td></tr>`;
  }).join('');
}
function renderAudit(){
  const am={Created:'badge-available',Updated:'badge-inuse',Deleted:'badge-danger',Restored:'badge-warning'};
  const im={Created:'fa-plus',Updated:'fa-pen',Deleted:'fa-trash-can',Restored:'fa-rotate-left'};
  document.getElementById('audit-tbody').innerHTML=[...auditLog].reverse().map(a=>{
    const l=laptops.find(x=>x.id===a.lid)||{brand:'?',model:'',serial:'?'};
    return`<tr><td style="font-size:11.5px;color:var(--text-muted);white-space:nowrap">${a.at}</td><td style="font-weight:500">${l.brand} ${l.model}</td><td><code>${l.serial}</code></td><td><span class="badge ${am[a.action]||''}"><i class="fas ${im[a.action]||'fa-circle'}"></i> ${a.action}</span></td><td>${a.by}</td><td style="font-size:11.5px;color:var(--text-muted)">${a.remarks||'—'}</td></tr>`;
  }).join('');
}
function renderTrash(){
  const d=laptops.filter(l=>l.deleted);
  document.getElementById('trashCount').textContent=`(${d.length} records)`;
  document.getElementById('trash-empty').style.display=d.length?'none':'block';
  document.getElementById('trash-content').style.display=d.length?'block':'none';
  document.getElementById('trash-tbody').innerHTML=d.map(l=>`
    <tr><td><div style="font-weight:600;color:#fff">${l.brand} ${l.model}</div><div style="font-size:11px;color:var(--text-muted)">${l.specs}</div></td>
    <td><code style="color:var(--text-muted)">${l.serial}</code></td>
    <td style="color:var(--text-muted);font-size:12px">${l.assignedTo||'—'}</td>
    <td><div class="actions">
      <button class="btn btn-success btn-sm" onclick="restoreLaptop(${l.id})"><i class="fas fa-rotate-left"></i> Restore</button>
      <button class="btn btn-danger btn-sm" onclick="permDeleteLaptop(${l.id})"><i class="fas fa-circle-xmark"></i> Delete Forever</button>
    </div></td></tr>`).join('');
}
function switchTab(name,btn){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');btn.classList.add('active');
}
function showToast(msg,type='success'){
  const t=document.createElement('div');
  t.className=`toast toast-${type}`;
  t.innerHTML=`<i class="fas fa-${type==='success'?'check-circle':'triangle-exclamation'}"></i> ${msg}`;
  document.getElementById('toast-area').prepend(t);
  setTimeout(()=>{t.style.transition='opacity .5s';t.style.opacity='0';setTimeout(()=>t.remove(),500);},4000);
}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('open');});
updateStats();renderDashboard();
