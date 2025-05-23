// src/app/courses/create/page.jsx (Corrected Hydration)
'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'react-bootstrap'
import 'bs-stepper/dist/css/bs-stepper.min.css'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import useBSStepper from '@/hooks/useBSStepper'

const courseSchema = yup.object({
  title: yup.string().required('Course title is required').max(255, 'Title must be at most 255 characters'),
  shortDescription: yup.string().required('Short description is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  level: yup.string().required('Level is required'),
  language: yup.string().required('Language is required'),
  modulesCount: yup.number().required('Number of modules is required').positive().integer().min(1, 'At least 1 module is required'),
  courseType: yup.string().required('Course type is required').oneOf(['recorded', 'live'], 'Invalid course type'),
  color: yup.string().required('Color is required'),
  icon: yup.string().required('Icon is required'),
  promoVideoUrl: yup.string().url('Invalid URL format').optional().nullable(),
  estimatedDuration: yup.string().required('Estimated duration is required'),
  totalLectures: yup.number().optional(),
  lectures: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required('Lecture title is required'),
        topic: yup.string().optional(),
        contentUrl: yup.string().required('Lecture content URL is required'),
      }),
    )
    .optional(),
  faqs: yup
    .array()
    .of(
      yup.object({
        question: yup.string().required('Question is required'),
        answer: yup.string().required('Answer is required'),
      }),
    )
    .optional(),
  tags: yup
    .array()
    .of(
      yup.object({
        tagName: yup.string().required('Tag Name is required'),
      }),
    )
    .optional(),
  messageToReviewer: yup.string().optional(),
})

const stepperOptions = {
  // Define options OUTSIDE the component
  linear: true, // Set to true to enforce step order
  animation: true,
}

const CreateCourseForm = () => {
  const { stepper, stepperRef } = useBSStepper(stepperOptions)
  const [currentStep, setCurrentStep] = useState(1)
  const [stepsCompleted, setStepsCompleted] = useState({
    step1: false,
    step2: false,
    step3: false
  })

  const methods = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      title: '',
      short_description: '', // Standardized field name
      description: '',
      category: '',
      level: '',
      language: '',
      modulesCount: 0,
      courseType: 'recorded',
      color: '#630000', // Default red color
      icon: 'FaBook', // Default book icon
      promoVideoUrl: '',
      estimatedDuration: '10 hours', // Default duration
      totalLectures: 0, // Will be calculated based on modules
      lectures: [],
      faqs: [],
      tags: [],
      messageToReviewer: '',
    },
  })
  const router = useRouter()

  // Effect to handle stepper navigation
  useEffect(() => {
    if (!stepper) return;

    // Add event listener for step change
    const stepChangeHandler = (event) => {
      const newStep = parseInt(event.detail.indexStep) + 1;
      setCurrentStep(newStep);

      // Prevent navigation to steps that haven't been unlocked
      if (newStep > 1) {
        const prevStepKey = `step${newStep - 1}`;
        if (!stepsCompleted[prevStepKey]) {
          event.preventDefault();
          toast.error(`Please complete Step ${newStep - 1} before proceeding.`);
          return false;
        }
      }
    };

    // Add event listener to stepper element
    const stepperElement = stepper._element;
    stepperElement.addEventListener('show.bs-stepper', stepChangeHandler);

    return () => {
      // Clean up event listener
      stepperElement.removeEventListener('show.bs-stepper', stepChangeHandler);
    };
  }, [stepper, stepsCompleted]);

  const goToNextStep = async (stepCompleted) => {
    if (stepper) {
      // Mark the current step as completed
      if (stepCompleted) {
        setStepsCompleted(prev => ({
          ...prev,
          [`step${currentStep}`]: true
        }));
      }
      stepper.next();
    }
  }

  const goBackToPreviousStep = () => {
    if (stepper) {
      stepper.previous();
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log(data, 'data')
      // const response = await axios.post('/api/courses/create', data);
      // if (response.status === 201) {
      //   toast.success('Course created successfully!');
      //   router.push('/instructor/courses');
      // } else {
      //   toast.error(response.data.error || 'Failed to create course.');
      // }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error(error.response?.data?.error || 'An unexpected error occurred.')
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col md={8} className="mx-auto text-center">
            <p>Use this interface to add a new Course...</p>
          </Col>
        </Row>
        <Card className="bg-transparent border rounded-3 mb-5">
          <div id="stepper" ref={stepperRef} className="bs-stepper stepper-outline" suppressHydrationWarning={true}>
            {' '}
            {/* Add suppressHydrationWarning */}
            <CardHeader className="bg-light border-bottom px-lg-5">
              <div className="bs-stepper-header" role="tablist">
                {/* Step 1 */}
                <div className="step" data-target="#step-1">
                  <div className="d-grid text-center align-items-center">
                    <button
                      type="button"
                      className="btn btn-link step-trigger mb-0"
                      role="tab"
                      id="steppertrigger1"
                      aria-controls="step-1"
                    >
                      <span className={`bs-stepper-circle ${stepsCompleted.step1 ? 'bg-success' : ''}`}>1</span>
                    </button>
                    <h6 className="bs-stepper-label d-none d-md-block">Course details</h6>
                  </div>
                </div>
                <div className="line" />

                {/* Step 2 */}
                <div className="step" data-target="#step-2">
                  <div className="d-grid text-center align-items-center">
                    <button
                      type="button"
                      className="btn btn-link step-trigger mb-0"
                      role="tab"
                      id="steppertrigger2"
                      aria-controls="step-2"
                      disabled={!stepsCompleted.step1}
                    >
                      <span className={`bs-stepper-circle ${stepsCompleted.step2 ? 'bg-success' : ''}`}>2</span>
                    </button>
                    <h6 className="bs-stepper-label d-none d-md-block">Course media</h6>
                  </div>
                </div>
                <div className="line" />

                {/* Step 3 */}
                <div className="step" data-target="#step-3">
                  <div className="d-grid text-center align-items-center">
                    <button
                      type="button"
                      className="btn btn-link step-trigger mb-0"
                      role="tab"
                      id="steppertrigger3"
                      aria-controls="step-3"
                      disabled={!stepsCompleted.step2}
                    >
                      <span className={`bs-stepper-circle ${stepsCompleted.step3 ? 'bg-success' : ''}`}>3</span>
                    </button>
                    <h6 className="bs-stepper-label d-none d-md-block">Curriculum</h6>
                  </div>
                </div>
                <div className="line" />

                {/* Step 4 */}
                <div className="step" data-target="#step-4">
                  <div className="d-grid text-center align-items-center">
                    <button
                      type="button"
                      className="btn btn-link step-trigger mb-0"
                      role="tab"
                      id="steppertrigger4"
                      aria-controls="step-4"
                      disabled={!stepsCompleted.step3}
                    >
                      <span className="bs-stepper-circle">4</span>
                    </button>
                    <h6 className="bs-stepper-label d-none d-md-block">Additional information</h6>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <FormProvider {...methods}>
                {/* <form onSubmit={methods.handleSubmit(onSubmit)}> */}
                <div className="bs-stepper-content">
                  <Step1 goToNextStep={goToNextStep} />
                  <Step2 goToNextStep={goToNextStep} goBackToPreviousStep={goBackToPreviousStep} />
                  <Step3 goToNextStep={goToNextStep} goBackToPreviousStep={goBackToPreviousStep} />
                  <Step4 goBackToPreviousStep={goBackToPreviousStep} />
                </div>
                {/* </form> */}
              </FormProvider>
            </CardBody>
          </div>
        </Card>
      </Container>
    </section>
  )
}

export default CreateCourseForm
