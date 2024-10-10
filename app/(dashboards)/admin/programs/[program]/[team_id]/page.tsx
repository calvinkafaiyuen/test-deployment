export default function Page({ params }: { params: { program: string, team_id: string } }) {
    const program = params.program
    const team_id = params.team_id
    return (
      <div>
          <p>Program using page params: {program}</p>
          <p>Team ID using page params: {team_id}</p>
      </div>
    )
  }