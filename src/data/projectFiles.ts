export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  purpose: string;
  logic: string;
  tradeoffs: string;
  code: string;
}

export interface ProjectRepo {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
}

export const PROJECT_REPOS: ProjectRepo[] = [
  {
    id: 'nova',
    name: 'Nova AI RFP Automator',
    description: 'React + TypeScript business workflow automation interface.',
    files: [
      {
        name: 'RfpGrid.tsx',
        path: 'src/components/RfpGrid.tsx',
        language: 'typescript',
        purpose: 'Renders list of active RFP sheets with real-time editing and batch validation.',
        logic: 'Implements window virtualization (react-window) and batch dispatch queues to prevent thread blockage.',
        tradeoffs: 'Chose client-side pagination over server-side because dataset is small (<500 items) and instant local sorting/filtering was critical for user flow.',
        code: `import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

interface RfpRow {
  id: string;
  title: string;
  progress: number;
  status: 'draft' | 'review' | 'complete';
}

export const RfpGrid: React.FC<{ data: RfpRow[] }> = ({ data }) => {
  // Memoize column indices to prevent layout recalculations
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' as const },
    { Header: 'Project Name', accessor: 'title' as const },
    { Header: 'Matching Progress', accessor: 'progress' as const },
    { Header: 'State', accessor: 'status' as const }
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = 
    useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()} className="w-full border-collapse">
      <thead>
        {headerGroups.map(hg => (
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map(col => (
              <th {...col.getHeaderProps(col.getSortByToggleProps())} className="p-2 border-b">
                {col.render('Header')}
                <span>{col.isSorted ? (col.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="hover:bg-white/5">
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} className="p-2 border-b text-xs">
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};`
      },
      {
        name: 'rfpHooks.ts',
        path: 'src/hooks/rfpHooks.ts',
        language: 'typescript',
        purpose: 'Manages asynchronous RFP document matching queues.',
        logic: 'Debounces keyboard query inputs and triggers validation loops.',
        tradeoffs: 'Chose custom debounce over loading full state manager (Redux) to keep this specific route lightweight.',
        code: `import { useState, useEffect } from 'react';

export function useRfpSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250); // 250ms delay window

    return () => clearTimeout(handler);
  }, [query]);

  return {
    query,
    setQuery,
    debouncedQuery
  };
}`
      }
    ]
  },
  {
    id: 'mindwave',
    name: 'Mindwave Personal AI OS',
    description: 'Decoupled Python FastAPI server and MongoDB client system.',
    files: [
      {
        name: 'main.py',
        path: 'app/main.py',
        language: 'python',
        purpose: 'Application entry point and CORS routing configs.',
        logic: 'Loads local HuggingFace embedding models asynchronously during server booting hook.',
        tradeoffs: 'Selected FastAPI over Django for this microservice due to built-in async loops and high request throughput.',
        code: `from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import logs
from app.core.config import settings

app = FastAPI(title="Mindwave Core Engine", version="1.0.0")

# CORS setup for dashboard origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Warm up local embedding model into RAM
    from app.services.embedding import embedding_service
    embedding_service.preload_model()

app.include_router(logs.router, prefix="/api/v1/logs", tags=["Logs"])
`
      },
      {
        name: 'db.py',
        path: 'app/core/db.py',
        language: 'python',
        purpose: 'Establishes asynchronous connection client pool to MongoDB Atlas.',
        logic: 'Manages singleton client pool and registers DB disconnection hooks.',
        tradeoffs: 'MongoDB was selected over PostgreSQL because daily journal structures contain volatile properties.',
        code: `from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    return db.client[settings.DATABASE_NAME]

async def close_database_connection():
    if db.client:
        db.client.close()
        db.client = None
`
      }
    ]
  },
  {
    id: 'aquarium',
    name: 'Aquarium E-Commerce',
    description: 'Dockerized Django server with optimized MySQL relational indices.',
    files: [
      {
        name: 'docker-compose.yml',
        path: 'docker-compose.yml',
        language: 'yaml',
        purpose: 'Orchestrates frontend, backend, database, and cache containers.',
        logic: 'Uses healthcheck scripts to guarantee database availability before Django boots.',
        tradeoffs: 'Docker Compose was utilized to avoid local config drift issues during deployment.',
        code: `version: '3.8'

services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - .env

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: aquarium_db
      MYSQL_ROOT_PASSWORD: root_pass_secure
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 5
`
      },
      {
        name: 'models.py',
        path: 'shop/models.py',
        language: 'python',
        purpose: 'Catalog models with MySQL indexing logic.',
        logic: 'Uses Django metadata to apply composite indexes across category lookup fields.',
        tradeoffs: 'MySQL relational indexes were chosen to guarantee ACID compliance during purchases.',
        code: `from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, unique=True)

    class Meta:
        verbose_name_plural = "categories"

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Composite index to speed up shop landing catalog queries
        index_together = (('category', 'is_active'),)
`
      }
    ]
  }
];
