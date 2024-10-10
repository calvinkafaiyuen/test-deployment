"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Input, Spacer, Select, SelectItem, Textarea, Tab, Tabs, Button, Checkbox, Divider, Autocomplete, AutocompleteItem, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { programs, learnAboutHatcheryOptions, genderOptions, educationLevelOptions, industrySkills, businessSkills, technicalSkills } from "@/app/data/program-data";
import { applyToProgram } from "@/app/lib/programs/action";

interface FormProps {
  programType: string;
}

interface Education {
  id: number,
  educationLevel: string;
  program: string;
  university: string;
  gradYear: number;
}

interface Cofounder {
  firstName: string;
  lastName: string;
  primaryEmail: string;
  personalEmail: string;
  phone: string;
  linkedIn: string;
  gender: string;
  expertise: string;
  interest: string;
  about: string;
  education: Education[];
}

interface ProgramData {
  program: string;
  startupName: string;
  problemStatement: string;
  devSolution: string;
  cofounders: Cofounder[];
  LFCofounders: boolean;
  LFCofounderTitle: string;
  LFCofounderDescription: string;
  LFCofounderSkills: { [key: string]: string[] };
  LFCofounderOtherOption: { [key: string]: string };
  LFCofounderOtherText: { [key: string]: string };
  learnAboutHatchery: string;
}

interface Category {
  key: string;
  header: string;
  title: string;
  maxOptions: number;
  skills: string[];
  otherTextLabel: string;
}

const ProgramFormComponent: React.FC<FormProps> = ({ programType }) => {

  const router = useRouter();

  // skill categories stored in ProgramData.skills[key] and ProgramData.Other[key]
  const categories: Category[] = [
    {
      key: "industry",
      title: "Industries",
      header: "In what industry is your startup in?",
      maxOptions: 1,
      skills: industrySkills,
      otherTextLabel: "industry skills"
    },
    {
      key: "business",
      title: "Organizational Functional Areas",
      header: "What would be the organizational functional area that this cofounder should focus on?",
      maxOptions: 3,
      skills: businessSkills,
      otherTextLabel: "organizational functional areas"
    },
    {
      key: "technical",
      title: "Technical",
      header: "What is the area of expertise of this cofounder?",
      maxOptions: 3,
      skills: technicalSkills,
      otherTextLabel: "technical skills"
    }
  ];

  const [problemStatementLength, setProblemStatementLength] = useState(0);
  const [cofounderDescriptionLength, setCofounderDescriptionLength] = useState(0);
  const [devSolutionLength, setDevSolutionLength] = useState(0);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  let initialProgramData: ProgramData = {
    program: programType,
    startupName: "",
    problemStatement: "",
    devSolution: "",
    cofounders: [],
    LFCofounders: false,
    LFCofounderTitle: "",
    LFCofounderDescription: "",
    LFCofounderSkills: Object.fromEntries(
      categories.map(category => [category.key, []])
    ),
    LFCofounderOtherOption: Object.fromEntries(
      categories.map(category => [category.key, ""])
    ),
    LFCofounderOtherText: Object.fromEntries(
      categories.map(category => [category.key, ""])
    ),
    learnAboutHatchery: ""
  }

  const [programData, setProgramData] = useState<ProgramData>(initialProgramData);
  const [errors, setErrors] = useState<string[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const submitProgramForm = async (e: any) => {
    e.preventDefault();
    const res = await applyToProgram(programData);
    if (res.success) {
      router.push('/programs/confirmation');
    } else if (res.errors) {
      setErrors(res.errors);
      onOpen();
    }
  }

  const handleLFCofoundersChange = () => {
    setProgramData(prevState => ({...prevState, LFCofounders: !prevState.LFCofounders}))
  }

  const handleInputFieldChange = (key: string, value: string) => {
    setProgramData(prevState => ({...prevState, [key]: value}));
  }

  const handleNumberOfCofoundersChange = (num: number) => {
    setProgramData(prevState => {
      const newCofounders = [...prevState.cofounders];
      if (newCofounders.length < num) {
        for (let i = newCofounders.length; i < num; i++) {
          newCofounders.push({
            firstName: "",
            lastName: "",
            primaryEmail: "",
            personalEmail: "",
            phone: "",
            linkedIn: "",
            gender: "",
            expertise: "",
            interest: "",
            about: "",
            education: [{
              id: 0,
              educationLevel: "",
              program: "",
              university: "",
              gradYear: -1
            }]
          });
        }
      } else {
        newCofounders.splice(num);
      }
      return { ...prevState, cofounders: newCofounders };
    });
  };

  const handleCofounderInputFieldChange = (coIndex: number, key: string, value: string) => {
    setProgramData(prevState => {
      const updatedCofounders = [...prevState.cofounders];
      const cofounder = updatedCofounders[coIndex];
      updatedCofounders[coIndex] = { ...cofounder, [key]: value };
      return { ...prevState, cofounders: updatedCofounders };
    });
  };

  const handleCofounderEducationChange = (coIndex: number, eduIndex: number, key: string, value: string | number) => {
    setProgramData(prevState => {
      const updatedCofounders = [...prevState.cofounders];
      const cofounder = updatedCofounders[coIndex];
      const updatedEducation = [...cofounder.education];
      const updatedEducationItem = { ...updatedEducation[eduIndex], [key]: value };
      updatedEducation[eduIndex] = updatedEducationItem;
      updatedCofounders[coIndex] = { ...cofounder, education: updatedEducation };
      return { ...prevState, cofounders: updatedCofounders };
    });
  };

  const handleAddEducation = (coIndex: number) => {
    setProgramData(prevState => {
      const updatedCofounders = [...prevState.cofounders];
      const cofounder = updatedCofounders[coIndex];
      const updatedEducation = [...cofounder.education];
      updatedEducation.push({
        id: updatedEducation[updatedEducation.length - 1].id + 1,
        educationLevel: "",
        program: "",
        university: "",
        gradYear: -1
      });
      updatedCofounders[coIndex] = { ...cofounder, education: updatedEducation };
      return { ...prevState, cofounders: updatedCofounders };
    });
  };

  const handleRemoveEducation = (coIndex: number, eduIndex: number) => {
    setProgramData(prevState => {
      const updatedCofounders = [...prevState.cofounders];
      const cofounder = updatedCofounders[coIndex];
      const updatedEducation = [...cofounder.education];
      updatedEducation.splice(eduIndex, 1);
      updatedCofounders[coIndex] = { ...cofounder, education: updatedEducation };
      return { ...prevState, cofounders: updatedCofounders };
    });
  };

  const handleLFCofounderSkillsChange = (categoryName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setProgramData(prevState => {
      const updatedSkills = { ...prevState.LFCofounderSkills };
      if (e.target.checked) {
        updatedSkills[categoryName] = [...updatedSkills[categoryName], e.target.value];
      } else {
        updatedSkills[categoryName] = updatedSkills[categoryName].filter(id => id !== e.target.value);
      }
      return { ...prevState, LFCofounderSkills: updatedSkills };
    });
  }

  const handleLFCofounderOtherOptionChange = (key: string, value: string) => {
    setProgramData(prevState => ({
      ...prevState,
      LFCofounderOtherOption: { ...prevState.LFCofounderOtherOption, [key]: value }
    }));
  }

  const handleLFCofounderOtherTextChange = (key: string, value: string) => {
    setProgramData(prevState => ({
      ...prevState,
      LFCofounderOtherText: { ...prevState.LFCofounderOtherText, [key]: value }
    }));
  }

  return (
    <div className="px-2">
      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          Startup
        </p>
        <Spacer y={2} />
        <Input
          type="text"
          label="Startup Name"
          onValueChange={(val) => handleInputFieldChange("startupName", val)}
          isRequired
        />
        <Spacer y={2} />
        <Textarea
          type="text"
          label="Problem Statement"
          description={`Provide a description of the problem you are trying to solve, 
                        including the size of the problem, how it is currently being addressed, 
                        and its impact on users/consumers. (` + (1500 - problemStatementLength) + ` characters left)`}
          maxLength={1500}
          onValueChange={(val) => {
            handleInputFieldChange("problemStatement", val)
            setProblemStatementLength(val.length)
          }}
          isRequired
        />
        {programType !== "NEST" && (
          <>
            <Spacer y={2} />
            <Textarea
              type="text"
              label="Basis for Development of Solution"
              description={`Please describe your solution, what makes it unique, and how the research you have conducted informs your solution. 
                            (` + (1500 - devSolutionLength) + ` characters left)`}
              maxLength={1500}
              onValueChange={(val) => {
                handleInputFieldChange("devSolution", val)
                setDevSolutionLength(val.length)
              }}
              isRequired
            />
          </>
        )}
      </div>

      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          Cofounders
        </p>
        <Spacer y={2} />
        <p className="text-sm">Tell us about the cofounder(s)</p>
        <p className="text-sm">Note: UofT students must provide their UTmail. Otherwise, they are not considered UofT students</p>
        <Spacer y={4} />
        <Select 
          label="Number of Cofounders"
          className="max-w-xs"
          onChange={(e) => handleNumberOfCofoundersChange(parseInt(e.target.value))}
          isRequired
        >
          {Array.from({ length: 9 }, (_, index) => (
            <SelectItem key={index + 1} value={index + 1}>
              {String(index + 1)}
            </SelectItem>
          ))}
        </Select>
        {!Number.isNaN(programData.cofounders.length) && programData.cofounders.length !== 0 && (
          <Spacer y={4} />
        )}
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" color="primary">
            {programData.cofounders.map((cofounder, coIndex) => (
              <Tab key={coIndex} title={"Cofounder " + String(coIndex + 1)}>
                <Spacer y={4} />
                <p className="font-bold">
                  Personal Info
                </p>
                <Spacer y={2} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Input
                    type="text"
                    variant="underlined"
                    label="First Name"
                    defaultValue={cofounder.firstName}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "firstName", val)}
                    isRequired
                  />
                  <Input
                    type="text"
                    variant="underlined"
                    label="Last Name"
                    defaultValue={cofounder.lastName}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "lastName", val)}
                    isRequired
                  />
                  <Input
                    type="email"
                    variant="underlined"
                    label="Primary Email"
                    defaultValue={cofounder.primaryEmail}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "primaryEmail", val)}
                    isRequired
                  />
                  <Input
                    type="email"
                    variant="underlined"
                    label="Personal Email"
                    defaultValue={cofounder.personalEmail}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "personalEmail", val)}
                    isRequired
                  />
                  <Input
                    type="phone"
                    variant="underlined"
                    label="Phone Number"
                    defaultValue={cofounder.phone}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "phone", val)}
                    isRequired
                  />
                  <Input
                    type="url"
                    variant="underlined"
                    label="LinkedIn URL"
                    defaultValue={cofounder.linkedIn}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "linkedIn", val)}
                    isRequired
                  />
                  <Select 
                    variant="underlined"
                    label="Gender"
                    defaultSelectedKeys={cofounder.gender !== "" ? [cofounder.gender] : []}
                    onChange={(e) => handleCofounderInputFieldChange(coIndex, "gender", e.target.value)}
                    isRequired
                  >
                    {genderOptions.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="text"
                    variant="underlined"
                    label="Area of Expertise"
                    defaultValue={cofounder.expertise}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "expertise", val)}
                    isRequired
                  />
                  <Input
                    type="text"
                    variant="underlined"
                    label="Area of Interest"
                    defaultValue={cofounder.interest}
                    onValueChange={(val) => handleCofounderInputFieldChange(coIndex, "interest", val)}
                    isRequired
                  />
                </div>
                <Spacer y={8} />
                <Textarea
                  type="text"
                  variant="bordered"
                  label="About Me"
                  placeholder={"Example: I'm a 4th year Engineering student and I'm interested working in FinTech, MedTech, Machine Learning, AI, Neural Networks, Hospitality, and sports-related fields. I'm passionate about the environment, sustainability, selfcare, as well as health and wellness."}
                  description={"Tell us about yourself in 50 words"}
                  maxLength={1500}
                  defaultValue={cofounder.about}
                  onValueChange={(val) => {
                    setProblemStatementLength(val.length)
                    handleCofounderInputFieldChange(coIndex, "about", val)
                  }}
                  isRequired
                />
                <Spacer y={8} />
                <p className="font-bold">
                  Educational History
                </p>
                <Spacer y={2} />
                <div>
                  {cofounder.education.map((edu, eduIndex) => (
                    <div key={edu.id}>
                      <div className="flex items-start">
                        {eduIndex !== 0 && (
                          <Button 
                            isIconOnly 
                            color="danger" 
                            size="sm" 
                            variant="flat" 
                            className="rounded-full mt-4 mr-4"
                            onClick={() => handleRemoveEducation(coIndex, eduIndex)}
                          >
                            x
                          </Button>
                        )}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <Select 
                            variant="underlined"
                            label="Education Level"
                            defaultSelectedKeys={edu.educationLevel !== "" ? [edu.educationLevel] : []}
                            onChange={(e) => handleCofounderEducationChange(coIndex, eduIndex, "educationLevel", e.target.value)}
                            isRequired
                          >
                            {educationLevelOptions.map((edu) => (
                              <SelectItem key={edu} value={edu}>
                                {edu}
                              </SelectItem>
                            ))}
                          </Select>
                          <Autocomplete
                            allowsCustomValue
                            type="text"
                            variant="underlined"
                            label="Program"
                            defaultInputValue={edu.program}
                            onInputChange={(val) => handleCofounderEducationChange(coIndex, eduIndex, "program", val)}
                            isRequired
                          >
                            {programs.map((program, programIndex) => (
                              <AutocompleteItem key={programIndex} value={program}>
                                {program}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                          <Input
                            type="text"
                            variant="underlined"
                            label="University"
                            defaultValue={edu.university}
                            onValueChange={(val) => handleCofounderEducationChange(coIndex, eduIndex, "university", val)}
                            isRequired
                          />
                          <div className="flex items-center">
                            <Select 
                              variant="underlined"
                              label="Graduation Year"
                              defaultSelectedKeys={edu.gradYear !== -1 ? [String(edu.gradYear)] : []}
                              onChange={(e) => handleCofounderEducationChange(coIndex, eduIndex, "gradYear", parseInt(e.target.value))}
                              isRequired
                            >
                              {Array.from({ length: 131 }, (_, yearIndex) => {
                                const year = 2030 - yearIndex;
                                return (
                                  <SelectItem key={year} value={year}>
                                      {String(year)}
                                  </SelectItem>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Spacer y={2} />
                    </div>
                  ))}
                  <div className="flex items-center mt-4 mr-4">
                    <Button 
                      isIconOnly 
                      color="primary" 
                      size="sm" 
                      variant="flat" 
                      className="rounded-full inline-block"
                      onClick={() => handleAddEducation(coIndex)}
                    >
                      +
                    </Button>
                    <p className="ml-4 text-sm">Add row</p>
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>

      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          Looking for Cofounders?
        </p>
        <Spacer y={2} />
        <div className="flex w-full flex-col">
          <Tabs 
            aria-label="Options" 
            color="primary" 
            defaultSelectedKey={"no"}
            onSelectionChange={() => handleLFCofoundersChange()}
          >
            <Tab key={"yes"} title={"Yes"}>
              <p className="text-sm">Define a criteria for your next cofounder.</p>
              <Spacer y={4} />
              <Input
                type="text"
                label="Who are you looking for?"
                placeholder="Software Engineer"
                defaultValue={programData.LFCofounderTitle}
                onValueChange={(val) => handleInputFieldChange("LFCofounderTitle", val)}
                isRequired
              />
              <Spacer y={2} />
              <Textarea
                type="text"
                label="Please describe the talents and expected duties of the cofounder."
                placeholder={"We are looking for a software engineer specialized in machine learning and neural network using python. You will be part of a development team that will be working on signature fraud identification system that provides Saas to IBM and Amazon."}
                maxLength={500}
                description={`(` + (500 - cofounderDescriptionLength) + ` characters left)`}
                defaultValue={programData.LFCofounderDescription}
                onValueChange={(val) => {
                  handleInputFieldChange("LFCofounderDescription", val)
                  setCofounderDescriptionLength(val.length)
                }}
                isRequired
              />
              <Spacer y={4} />
              <p className="font-bold">Which of the following applies to your startup?</p>
              <Spacer y={2} />
              <div className="flex w-full flex-col">
                <Tabs aria-label="Options" color="primary">
                  {categories.map((category, index) => (
                    <Tab key={index} title={category.title}>
                      <Divider className="mt-2 mb-4" />
                      <p className="font-bold text-sm">{category.header}</p>
                      <p className="text-sm">Please select only {category.maxOptions}. Selections left: {category.maxOptions - programData.LFCofounderSkills[category.key].length}</p>
                      <Divider className="my-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {category.skills.map((skill, index) => (
                          <Checkbox 
                            key={index} 
                            value={skill}
                            size="sm" 
                            onChange={e => handleLFCofounderSkillsChange(category.key, e)}
                            defaultSelected={programData.LFCofounderSkills[category.key].includes(skill)}
                            isDisabled={
                              programData.LFCofounderSkills[category.key].length >= category.maxOptions
                              && !programData.LFCofounderSkills[category.key].includes(skill)
                            }
                          >
                            {skill}
                          </Checkbox>
                        ))}
                      </div>
                      {category.key !== "industry" && (
                        <>
                          <Spacer y={4} />
                          <div className="flex">
                            <Checkbox
                              key={"Other"}
                              value={"Other"}
                              size="sm"
                              onChange={(e) => handleLFCofounderSkillsChange(category.key, e)}
                              defaultSelected={programData.LFCofounderSkills[category.key].includes("Other")}
                              isDisabled={
                                programData.LFCofounderSkills[category.key].length >= category.maxOptions
                                && !programData.LFCofounderSkills[category.key].includes("Other")
                              }
                            >
                            </Checkbox>
                            <Input
                              type="text"
                              size="sm"
                              variant="bordered"
                              label="Other"
                              labelPlacement="outside-left"
                              defaultValue={programData.LFCofounderOtherOption[category.key]}
                              onValueChange={(val) => handleLFCofounderOtherOptionChange(category.key, val)}
                              isDisabled={!programData.LFCofounderSkills[category.key].includes("Other")}
                              isRequired
                            />
                          </div>
                        </>
                      )}
                      <Divider className="my-4" />
                      <Input
                        type="text"
                        label={`Or tell us about the ${category.otherTextLabel} you are looking for in sentences:`}
                        variant="bordered"
                        placeholder="I am looking for..."
                        defaultValue={programData.LFCofounderOtherText[category.key]}
                        onValueChange={(val) => handleLFCofounderOtherTextChange(category.key, val)}
                      />
                    </Tab>
                  ))}
                </Tabs>
              </div>
            </Tab>
            <Tab key={"no"} title={"No"} />
          </Tabs>
        </div>
      </div>
      
      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          How did you learn about UofT Hatchery?
        </p>
        <Spacer y={4} />
        <Select 
          label="Where did you learn about us?"
          onChange={(e) => handleInputFieldChange("learnAboutHatchery", e.target.value)}
          isRequired
        >
          {learnAboutHatcheryOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          Final Steps
        </p>
        <Spacer y={2} />
        <p className="text-sm">
          * The profile you are submitting will be discoverable on the Hatchery Build-A-Team Tool (a platform designed to match individuals and startups based on skills and interests)
        </p>
        <Spacer y={2} />
        <Checkbox 
          key={0}
          size="sm"
          onChange={() => setIsTermsChecked(!isTermsChecked)}
        >
          I agree to the <Link href="#" className="text-md font-bold hover:underline">terms and conditions</Link>
        </Checkbox>
        <Spacer y={4} />
        <Button 
          type="submit"
          color="primary"
          variant="flat"
          isDisabled={!isTermsChecked}
          onClick={submitProgramForm}
        >
          Submit
        </Button>
        <Spacer y={4} />
        {errors && (
          <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size="2xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="font-bold">Form Errors</ModalHeader>
                  <ModalBody>
                    <p className="font-bold">
                      Please resolve the following form errors before continuing:
                    </p>
                    {errors.map((err, index) => (
                      <p key={index}>
                        {err}
                      </p>
                    ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
      
      <Spacer y={8} />

    </div>
  );
}

export default ProgramFormComponent;