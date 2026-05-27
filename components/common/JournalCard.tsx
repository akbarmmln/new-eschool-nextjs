import { format } from 'date-fns'
import Link from "next/link"
import {id} from 'date-fns/locale'
import { useEffect, useState } from "react";

type Props = {
  item: any
}


export default function JournalCard({ item } : Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);

      // await downloadFile(id);

    } finally {
      // setDownloadingId(null);
    }
  };
  const hadir =
    item.detail_siswa.filter(
      (x: any) => x.absensi == '1'
    ).length

  const ijin  =
    item.detail_siswa.filter(
      (x: any) => x.absensi == '2'
    ).length

    const sakit =
    item.detail_siswa.filter(
      (x: any) => x.absensi == '3'
    ).length

  const alpha =
    item.detail_siswa.filter(
      (x: any) => x.absensi == '4'
    ).length

  function renderContent(value: string) {
    if (!value) {
      return '-'
    }

    // jika HTML dari editor
    if (value.includes('<')) {

      return (
        <div
          dangerouslySetInnerHTML={{
            __html: value
          }}
        />
      )
    }

    // jika plain text
    return (
      <div
        style={{
          whiteSpace:
            'pre-wrap',
        }} >
        {value}
      </div>
    )
  }

  return (
    <div className="journal-card">

      {/* HEADER */}
      <div className="journal-header">
        <div>
          <h2>
            {
              format(
                new Date(
                  item.tanggal_jurnal
                ),
                'EEEE, dd MMMM yyyy',
                { locale: id }
              )
            }
          </h2>

          <p>
            {item.nama_kelas}
            {' • '}
            {item.jam_mulai}
            {' - '}
            {item.jam_selesai}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="journal-content dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
        <div className="journal-section">
          <h3>
            MATERI
          </h3>

          <div className="journal-text">
            {renderContent(
              item.materi
            )}
          </div>
        </div>

        <div className="journal-section">
          <h3>
            REFLEKSI
          </h3>
          <div className="journal-text">
            {renderContent(
              item.refleksi
            )}
          </div>
        </div>

        <div className="journal-section journal-attendance">
          <h3>
            RINGKASAN KEHADIRAN
          </h3>
          <div className="journal-text">
            <div className="journal-badge">
              <span className="badge-h">
                H : {hadir}
              </span>

              <span className="badge-i">
                I : {ijin}
              </span>

              <span className="badge-s">
                S : {sakit}
              </span>

              <span className="badge-a">
                A : {alpha}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="journal-footer dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
        <button onClick={() => handleDownload(item.id)}>
          <i
            className={
              downloadingId === item.id
                ? "ti ti-loader-2 spin"
                : "ri-download-line"
            }
          />
        </button>

        <Link href={`/akademik/aktifitas-jurnal/${item.id}`}>
          <button>
            <i className="ri-edit-line" />
          </button>
        </Link>
        
        <button>
          <i className="ri-delete-bin-line" />
        </button>
      </div>

      <style jsx>
        {`
          .spin {
              display: inline-block;
              animation: spin 1s linear infinite;
          }

          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }

          :global(.dark) .journal-text {

            color: rgba(255,255,255,.88);
          }
          :global(.dark) .journal-section h3 {

            color: #7c7cff;
          }
          :global(.dark) .journal-footer {

            border-top:
              1px solid rgba(255,255,255,.08);
          }
          :global(.dark) .journal-card {

            background: #162033;
          }
          :global(.dark) .journal-footer button {

            background:
              rgba(255,255,255,.06);

            color:
              rgba(255,255,255,.8);
          }
    
          .journal-card {
            background: #fff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(15,23,42,.06);
            display: flex;
            flex-direction: column;
            min-height: 520px;
            transition: .25s;
          }

          .journal-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 40px rgba(15,23,42,.1);
          }

          .journal-header {
            background: linear-gradient(
              90deg,
              #4f8cff 0%,
              #5b7fff 50%,
              #696cff 100%
            );
            padding-top: 15px;
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 15px;

            color: white;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }

          .journal-header h2 {
            margin: 0;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.3;
          }

          .journal-header p {
            margin-top: 8px;
            opacity: .92;
            font-size: 12px;
            line-height: 1.5;
          }

          .journal-badge {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
          }

          .journal-badge span {
            padding: 2px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 500;
            color: white;
          }

          .journal-attendance {
            margin-top: auto;
          }

          .badge-h {
            background: #22c55e;
          }

          .badge-i {
            background: #535c7e;
          }

          .badge-s {
            background: #06b6d4;
          }

          .badge-a {
            background: #ef4444;
          }

          .journal-content {
            padding-top: 28px;
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 28px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 28px;
          }

          .journal-section h3 {
            font-size: 15px;
            font-weight: 500;
            letter-spacing: .4px;
            color: #4f46e5;
          }

          .journal-text {
            color: #334155;
            line-height: 1.9;
            font-size: 14px;
            word-break: break-word;
          }

          .journal-footer {
            padding: 10px 10px;
            border-top: 1px solid #eef2ff;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .journal-footer button {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 10px;
            background: #06b6d4;
            cursor: pointer;
            transition: .2s;
            font-size: 18px;
            color: #475569;
          }

          .journal-footer button:hover {
            background: #eef2ff;
            color: #4f46e5;
          }
      `}
      </style>
    </div>
  )
}