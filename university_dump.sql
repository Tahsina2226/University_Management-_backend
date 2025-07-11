--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batches (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    semester character varying(50),
    department character varying(100)
);


ALTER TABLE public.batches OWNER TO postgres;

--
-- Name: batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batches_id_seq OWNER TO postgres;

--
-- Name: batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.batches_id_seq OWNED BY public.batches.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    user_email character varying(100) NOT NULL,
    batch_id integer NOT NULL,
    batch_department character varying(100) NOT NULL
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO postgres;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255),
    description text,
    date date,
    location character varying(100)
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255),
    description text,
    date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: routines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routines (
    id integer NOT NULL,
    batch_id integer,
    course_name character varying(100),
    day character varying(50),
    "time" character varying(100),
    room character varying(50)
);


ALTER TABLE public.routines OWNER TO postgres;

--
-- Name: routines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.routines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routines_id_seq OWNER TO postgres;

--
-- Name: routines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.routines_id_seq OWNED BY public.routines.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    name character varying(100) DEFAULT 'Unknown'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: batches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches ALTER COLUMN id SET DEFAULT nextval('public.batches_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: routines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routines ALTER COLUMN id SET DEFAULT nextval('public.routines_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batches (id, name, semester, department) FROM stdin;
15	ARC-2024	Summer 2024	Architecture
16	PH-2023	Fall 2023	Pharmacy
17	CE-2022	Spring 2022	Civil Engineering
18	JMC-2025	Fall 2025	Journalism and Media Communication
19	ICT-2024	Summer 2024	Information and Communication Technology
10	CSE-2023	Fall 2024	Computer Science and Engineering
12	BBA-2022	Summer 2023	Business Administration
13	LLB-2023	Fall 2023	Law
20	jninh	jninh	jninh
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name) FROM stdin;
1	CSE
2	EEE
3	Computer Science
4	Computer Science
5	Electrical Engineering
6	Business Administration
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_email, batch_id, batch_department) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, date, location) FROM stdin;
1	Orientation	New student orientation	2025-07-20	Auditorium
2	Spring Cultural Festival	Celebrate the arrival of spring with music, dance, and food stalls.	2025-03-21	University Auditorium
3	Tech Symposium 2025	A conference on emerging technologies and innovations.	2025-04-10	Engineering Building, Room 204
4	Guest Lecture: Environmental Sustainability	An insightful lecture on environmental conservation and sustainability practices.	2025-05-05	Science Block, Lecture Hall 3
5	Annual Sports Day	Join us for a day full of sports competitions and team events.	2025-06-12	University Sports Ground
6	Art Exhibition	Showcasing artworks by students and faculty members.	2025-07-01	Art Gallery, Main Hall
7	Career Fair 2025	Meet top employers and explore internship and job opportunities.	2025-08-20	Convention Center
8	Music Night	An evening of live performances by university bands and solo artists.	2025-09-15	Open Air Theater
9	Science & Tech Expo	Exhibition of scientific projects and technology demonstrations.	2025-10-10	Science Block, Exhibition Hall
10	Alumni Meet 2025	Reconnect with old friends and network with alumni from various batches.	2025-11-25	University Conference Hall
11	Winter Fest	Celebrate the end of the year with fun activities, food stalls, and performances.	2025-12-20	Central Lawn
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, description, date) FROM stdin;
1	New Semester	Classes resume from July 15th	2025-07-07
2	New Semester	Classes resume from July 15th	2025-07-06
3	Library Renovation	Library will be closed for maintenance from July 10 to July 20	2025-07-08
4	Blood Donation Camp	Organized by Red Crescent Club on July 12 at the university auditorium	2025-07-09
5	Inter-University Debate	Debate competition on July 18 with 10 universities participating	2025-07-11
6	ICT Seminar	Experts from the ICT sector will join a seminar on July 16	2025-07-10
7	Club Fair 2025	All clubs will showcase their work and recruit new members	2025-07-12
8	Career Counseling Session	Learn about job opportunities and CV writing tips	2025-07-13
9	Photography Contest	Open for all students. Submit entries by July 19.	2025-07-14
10	Alumni Meet	Alumni gathering and networking session on July 21	2025-07-15
11	Workshop on Web Development	Hands-on training on full-stack web development	2025-07-17
\.


--
-- Data for Name: routines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routines (id, batch_id, course_name, day, "time", room) FROM stdin;
33	15	math19	monday	9.00-10.30	309
22	15	International Law	Saturday	9:00 AM - 10:00 AM	Room 403
23	18	Information Security	Monday	9:00 AM - 10:00 AM	Room 501
37	19	kice	monday	9.00-10.00	409
24	19	Database Systems	Monday	10:00 AM - 11:00 AM	Room 502
10	10	Operating Systems	Sunday	9:00 AM - 10:00 AM	Room 103
16	10	Machine Learning	Tuesday	10:00 AM - 11:00 AM	Room 107
15	10	Software Engineering	Tuesday	9:00 AM - 10:00 AM	Room 106
14	10	Computer Networks	Monday	11:00 AM - 12:00 PM	Room 105
11	10	Databases	Sunday	10:00 AM - 11:00 AM	Room 104
38	12	kire33	monday	5.00	309
19	12	Human Resource Management	Thursday	9:00 AM - 10:00 AM	Room 303
18	12	Financial Accounting	Wednesday	10:00 AM - 11:00 AM	Room 302
17	12	Marketing Management	Wednesday	9:00 AM - 10:00 AM	Room 301
21	13	Criminal Law	Friday	10:00 AM - 11:00 AM	Room 402
20	13	Constitutional Law	Friday	9:00 AM - 10:00 AM	Room 401
8	20	Data Structures	Saturday	9:00 AM - 10:00 AM	Room 101
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role, name) FROM stdin;
1	admi444w@university.com	password123	admin	tahuuu
2	user4445@university.com	password123	user	heyy
3	user44450@university.com	password123	user	tahia
4	admi4a44@university.com	password123	admin	jninhhhhh
\.


--
-- Name: batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.batches_id_seq', 21, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 6, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 1, false);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 11, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 11, true);


--
-- Name: routines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routines_id_seq', 51, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: routines routines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routines
    ADD CONSTRAINT routines_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: routines routines_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routines
    ADD CONSTRAINT routines_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

