// Organisation profiles. Public names are used for illustration; every notice,
// call, list and figure attached to them in this demo is sample content.
export const ORGS = {
  blufin: { id: 'blufin', name: 'Blufin Foundation', short: 'Blufin', kind: 'foundation', city: 'Bengaluru',
    about: 'Para-sports nonprofit founded in 2018 by Paralympian Sharath Gayakwad and Vyshak Iyengar, backed by Accel\'s philanthropic arm. Finds, funds and mentors para athletes, with a focus on para swimming.' },
  gosports: { id: 'gosports', name: 'GoSports Foundation', short: 'GoSports', kind: 'foundation', city: 'Bengaluru', about: 'Donor-funded nonprofit supporting junior Olympic and Paralympic athletes since 2008.' },
  ogq: { id: 'ogq', name: 'Olympic Gold Quest', short: 'OGQ', kind: 'foundation', city: 'Mumbai', about: 'Supports potential Olympic and Paralympic medallists; athletes are identified through a research team working with coaches and scouts.' },
  ksa: { id: 'ksa', name: 'Karnataka Swimming Association', short: 'KSA', kind: 'state', city: 'Bengaluru', sport: 'Aquatics', state: 'Karnataka',
    about: 'State association for aquatics in Karnataka. Runs state age-group championships that select Karnataka teams for the nationals.' },
  sfi: { id: 'sfi', name: 'Swimming Federation of India', short: 'SFI', kind: 'national', city: 'Ahmedabad', sport: 'Aquatics', about: 'National federation for aquatics. Issues the SFI UID required for national entries.' },
  bai: { id: 'bai', name: 'Badminton Association of India', short: 'BAI', kind: 'national', city: 'New Delhi', sport: 'Badminton',
    about: 'National federation for badminton and para badminton. Allots BAI Player IDs, runs the domestic ranking circuit and sends entries to BWF events.' },
  pci: { id: 'pci', name: 'Paralympic Committee of India', short: 'PCI', kind: 'national', city: 'New Delhi', sport: 'Para sports', about: 'National Paralympic Committee. Handles national classification and international entries for para sports.' },
  aai: { id: 'aai', name: 'Archery Association of India', short: 'AAI', kind: 'national', city: 'New Delhi', sport: 'Archery', about: 'National federation for archery.' },
  khelo: { id: 'khelo', name: 'Khelo India (SAI)', short: 'Khelo India', kind: 'government', city: 'New Delhi', sport: 'All', about: 'National sports development programme. Issues Khelo India IDs and Games certificates.' },
  tidewater: { id: 'tidewater', name: 'Tidewater Infra CSR', short: 'Tidewater CSR', kind: 'donor', city: 'Mumbai', about: 'Fictional corporate CSR donor used in this demo.' },
}

export const orgName = (id) => ORGS[id]?.name || id
export const orgShort = (id) => ORGS[id]?.short || id
